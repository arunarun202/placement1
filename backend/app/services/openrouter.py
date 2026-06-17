import json
import httpx
from fastapi import HTTPException
from app.core.config import settings

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_MODEL = "openrouter/free"

async def _call_openrouter(messages: list, response_format: dict = None) -> str:
    if not settings.OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenRouter API key is missing")

    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "Placement Predictor",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": DEFAULT_MODEL,
        "messages": messages,
    }
    if response_format:
        payload["response_format"] = response_format

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(OPENROUTER_URL, headers=headers, json=payload, timeout=60.0)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Error communicating with OpenRouter: {str(e)}")

async def predict_placement(stats: dict) -> str:
    prompt = f"""
    You are an AI placement prediction expert. Evaluate the provided candidate statistics and predict their probability of getting a job in their target company.
    
    Candidate Stats:
    {json.dumps(stats, indent=2)}
    
    Please provide your response in the following format:
    Predicted Score: [A percentage score from 0% to 100%]
    Prediction Label: [High Probability / Medium Probability / Low Probability]
    Explanation: [A personalized, concise explanation considering their CGPA, skills, target company, and experience. Do not give generic advice, refer strictly to their stats.]
    """
    messages = [
        {"role": "system", "content": "You are a professional career advisor and predictive analytics AI."},
        {"role": "user", "content": prompt}
    ]
    return await _call_openrouter(messages)

async def evaluate_resume(resume_text: str, job_role: str) -> dict:
    prompt = f"""
    You are an expert Applicant Tracking System (ATS) and career coach.
    Evaluate the following resume for the target role: '{job_role}'.
    
    Resume Text:
    {resume_text[:4000]}
    
    You MUST respond with a valid JSON object ONLY. Do not include any conversational text, markdown formatting blocks (like ```json), or explanations outside the JSON object. Use the exact schema below:
    {{
      "ats_score": <integer from 0 to 100 representing the match score>,
      "suggestions": "<string containing actionable feedback for improvement>",
      "course_products": ["<course 1>", "<course 2>"],
      "alternative_roles": ["<role 1>", "<role 2>"],
      "role_courses": ["<specific course 1>", "<specific course 2>"]
    }}
    """
    messages = [
        {"role": "system", "content": "You are an ATS parser and career coach. You MUST respond in pure JSON without any markdown formatting."},
        {"role": "user", "content": prompt}
    ]
    # some models support response_format={"type": "json_object"}, but we'll try without strict enforcement
    response_text = await _call_openrouter(messages)
    
    try:
        # Try to parse the JSON output from the LLM
        # Sometimes LLMs wrap JSON in ```json ... ```
        clean_text = response_text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_text)
    except Exception:
        # fallback
        return {
            "ats_score": 50,
            "suggestions": "Failed to parse AI response. " + response_text,
            "course_products": [],
            "alternative_roles": [],
            "role_courses": []
        }

async def chat_response(history_messages: list, new_message: str) -> str:
    system_prompt = (
        "You are 'PredictAI', an intelligent career and placement assistant. "
        "Your goal is to guide students with their career path, resume building, and interview preparation. "
        "Keep your responses concise, friendly, and well-structured."
    )
    messages = [{"role": "system", "content": system_prompt}]
    
    if history_messages:
        history_context = "Here is the context of what the user has asked previously:\n"
        for msg in history_messages:
            history_context += f"- {msg}\n"
        messages.append({"role": "user", "content": history_context})
        messages.append({"role": "assistant", "content": "Noted. I will keep this context in mind."})
    
    messages.append({"role": "user", "content": new_message})
    
    return await _call_openrouter(messages)
