import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

def generate_answer(question, data):

    prompt = f"""
You are a pharmacy business assistant.

The user asked:
{question}

Database result:
{json.dumps(data, indent=2, default=str)}

Rules:
- Give a natural English answer.
- Explain business meaning.
- Do not show raw JSON.
- Do not use markdown.
- Do not use **bold**.
- Be concise but helpful.
- If multiple records exist, summarize them.
- If data is empty, clearly say no records were found.
"""

    try:

        response = model.generate_content(prompt)

        return response.text

    except Exception as e:

        print("Gemini Error:", str(e))

        return (
            "AI Assistant is currently unavailable. "
            "The AI service may have reached its usage limit. "
            "Please try again later."
        )