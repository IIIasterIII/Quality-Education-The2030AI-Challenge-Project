import { BACKEND_URL } from "@/app/api/router";

export const startStreaming = async (
  topic: string, 
  nodes: any[] = [], 
  edges: any[] = [],
  onChunk: (content: string) => void, 
  onFinished?: (fullContent: string) => void
) => {
  const response = await fetch(`${BACKEND_URL}/auth/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, nodes, edges }),
    credentials: "include"
  });


  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  let fullContent = "";

  while (true) {
    const { done, value } = await reader!.read();
    if (done) {
      let cleaned = fullContent.trim();
      
      const firstBrace = cleaned.indexOf('{');
      if (firstBrace !== -1) {
          let braceCount = 0;
          let lastMatch = -1;
          for (let i = firstBrace; i < cleaned.length; i++) {
              if (cleaned[i] === '{') braceCount++;
              else if (cleaned[i] === '}') braceCount--;
              if (braceCount === 0) {
                  lastMatch = i;
                  break;
              }
          }
          if (lastMatch !== -1) {
              cleaned = cleaned.substring(firstBrace, lastMatch + 1);
          }
      }
      
      if (onFinished) onFinished(cleaned);
      break;
    }



    const chunk = decoder.decode(value);
    fullContent += chunk;
    onChunk(fullContent);
  }
};