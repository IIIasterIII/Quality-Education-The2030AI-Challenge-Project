from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from openai import AsyncOpenAI
import json
import os

load_dotenv()
client = AsyncOpenAI( api_key=os.getenv("FEATHERLESS_API_KEY"), base_url=os.getenv("FEATHERLESS_BASE_URL") )

async def generate_roadmap_content(topic: str, existing_nodes: list = None, existing_edges: list = None):
    nodes_info = [{"id": n['id'], "label": n['data']['label']} for n in existing_nodes] if existing_nodes else []
    prompt = f"""
    SYSTEM: You are a professional roadmap architect. You output valid JSON deltas for React Flow.
    CURRENT NODES: {json.dumps(nodes_info, ensure_ascii=False)}
    TASK: Expand the roadmap for: '{topic}'. 
    INSTRUCTIONS:
    1. EXCLUSIVITY: Respond ONLY with the NEWLY ADDED or MODIFIED nodes/edges.
    2. DELTA MODE: DO NOT return existing nodes unless you are updating their labels/descriptions.
    3. LANGUAGE: Use English.
    4. STRUCTURE & STYLE:
       - EVERY node MUST have: "type": "roadmap"
       - Position new nodes vertically below the last existing node.
       - IMPORTANT: Use a vertical gap of at least 300px between every node.
       - Use descriptive, high-impact titles.
    5. JSON FORMAT:
    {{ "nodes": [ {{ "id": "node_827", "type": "roadmap", "position": {{ "x": 500, "y": 800 }}, "data": {{ "label": "Advanced Topics", "description": "Mastering the core concepts..." }} }} ],
        "edges": [ {{ "id": "edge_123", "source": "previous_node_id", "target": "node_827", "animated": true }} ] }}
    """
    try:
        response = await client.chat.completions.create(
            model="failspy/Meta-Llama-3-8B-Instruct-abliterated-v3",
            messages=[
                {"role": "system", "content": "You are a specialized React Flow generator. Return ONLY a single JSON object."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" },
            stream=True 
        )
        async def event_generator():
            async for chunk in response:
                if chunk.choices and chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    yield content 
        return StreamingResponse(event_generator(), media_type="text/plain")
    except Exception as e:
        print(f"AI Error: {e}")
        raise e

async def generate_exercise_content(note_content: str, level: str, type: str):
    """
    note_content: JSON/Text from the editor
    level: "foundational", "advanced", "expert"
    type: "quiz", "math_problems", "conceptual_questions"
    """
    # Truncate content to avoid token limit errors (~8k tokens context)
    MAX_CHARS = 12000 
    safe_content = note_content[:MAX_CHARS] if note_content else ""

    prompt = f"""
    TASK: Generate a {type} exercise at '{level}' level based on the following content:
    CONTENT: {safe_content}
    
    INSTRUCTIONS:
    1. QUALITY CHECK: If the CONTENT is empty, too short (less than 50 words), or contains no educational substance, you MUST return ONLY this JSON: {{"error": "insufficient_content"}}.
    2. If QUIZ: Return list of 5 multiple choice questions.
    3. If MATH: Return 3 advanced problems. Use LaTeX for ALL mathematical formulas and wrap them in custom MathJax delimiters (e.g., $...$ or $$...$$).
       CRITICAL: MATH VERIFICATION. For every math problem, you MUST internally simulate writing a Python script to solve the problem before generating the final answer. Ensure the result is 100% accurate. Prove the logic in the "explanation" field.
    4. If CONCEPTUAL: Return 10 deep-dive questions.
    
    CRITICAL: JSON ESCAPING RULE.
    Since we are using custom repair, strictly follow standard JSON. DO NOT over-escape.
    {{
      "title": "...",
      "items": [
        {{ "question": "...", "options": ["...", "..."], "answer": "...", "explanation": "..." }}
      ]
    }}
    """
    try:
        response = await client.chat.completions.create(
            model="failspy/Meta-Llama-3-8B-Instruct-abliterated-v3",
            messages=[
                {"role": "system", "content": "You are an educational AI. Use LaTeX for math. Return valid JSON. BE EXTREMELY CONCISE. DO NOT generate gigantic matrices. Max matrix size is 3x3."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" },
            max_tokens=2000,
            stream=True
        )
        async def event_generator():
            async for chunk in response:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        return StreamingResponse(event_generator(), media_type="text/plain")
    except Exception as e:
        print(f"Exercise AI Error: {e}")
        raise e

async def generate_note_summary(content: str):
    """
    Generate a concise AI summary of the note content.
    If content is insufficient, returns a specific JSON error.
    """
    # Truncate content to avoid token limit errors (~8k tokens context)
    MAX_CHARS = 12000 
    safe_content = content[:MAX_CHARS] if content else ""

    prompt = f"""
    TASK: Generate a concise, 2-3 sentence summary of the following educational content.
    CONTENT: {safe_content}
    
    INSTRUCTIONS:
    1. QUALITY CHECK: If the CONTENT is empty, too short (less than 30 words), or contains no meaningful educational substance, you MUST return ONLY this JSON: {{"error": "insufficient_content"}}.
    2. STYLE: Use a professional, academic tone. Be precise.
    3. FORMAT: Return a single JSON object: {{"summary": "..."}}.
    """
    try:
        response = await client.chat.completions.create(
            model="failspy/Meta-Llama-3-8B-Instruct-abliterated-v3",
            messages=[
                {"role": "system", "content": "You are a concise educational assistant. Return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" },
            max_tokens=500,
            stream=True
        )
        async def event_generator():
            async for chunk in response:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        return StreamingResponse(event_generator(), media_type="text/plain")
    except Exception as e:
        print(f"Summary AI Error: {e}")
        raise e

async def refine_note_content(content: str):
    """
    Take raw text (e.g., from PDF) and refine it into structured educational content.
    """
    # Truncate content to avoid token limit errors (~8k tokens context)
    MAX_CHARS = 12000 
    is_truncated = len(content) > MAX_CHARS
    safe_content = content[:MAX_CHARS]
    
    truncation_note = " (Note: The content was truncated to fit model context)" if is_truncated else ""
    prompt = f"""
    TASK: Refine the following raw text into a high-quality, structured educational note.
    
    INSTRUCTIONS:
    1. FORMATTING: Use Markdown extensively. Use # for main titles, ## for sections, and ### for sub-sections. Use bold **text** for emphasis. Use bullet points or numbered lists where appropriate. CRITICAL: DO NOT use Markdown tables; use lists or paragraphs instead.
    2. MATHEMATICS: Use LaTeX for ALL mathematical formulas. Wrap inline math in $...$ and block math in $$...$$. Ensure formulas are clear and professional.
    3. PEDAGOGY: Ensure the flow is logical and concepts are clearly explained.
    4. LANGUAGE: Maintain the original language of the text.
    
    {truncation_note}
    RAW CONTENT: {safe_content}
    """
    try:
        response = await client.chat.completions.create(
            model="failspy/Meta-Llama-3-8B-Instruct-abliterated-v3",
            messages=[
                {"role": "system", "content": "You are a world-class academic content architect. Output high-quality, structured Markdown with LaTeX math support."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500,
            stream=True
        )
        async def event_generator():
            async for chunk in response:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        return StreamingResponse(event_generator(), media_type="text/plain")
    except Exception as e:
        raise e