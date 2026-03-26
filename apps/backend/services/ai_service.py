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
    SYSTEM: You are a professional architect. Output valid JSON delta.
    CURRENT NODES: {json.dumps(nodes_info, ensure_ascii=False)}
    TASK: Execute: '{topic}'. 
    INSTRUCTIONS:
    1. EXCLUSIVITY: Respond ONLY with the NEWLY ADDED or MODIFIED nodes/edges.
    2. DELTA MODE: DO NOT return existing nodes that haven't changed.
    3. LANGUAGE: Use English.
    4. STRUCTURE:
       {{ "nodes": [ {{ "id": "node_827", "type": "roadmap", "position": {{ "x": 200, "y": 200 }}, "data": {{ "label": "...", "description": "..." }} }} ],
         "edges": [ {{ "id": "edge_123", "source": "existing_id", "target": "node_827" }} ] }}
    5. POSITIONING: Y starts at 200+ or below last node. Gap 200px.
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
    prompt = f"""
    TASK: Generate a {type} exercise at '{level}' level based on the following content:
    CONTENT: {note_content}
    
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