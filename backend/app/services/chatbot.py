from google import genai
from app.config import GOOGLE_API_KEY

client = genai.Client(api_key=GOOGLE_API_KEY)

def ask_gemini(message: str):
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=message
        )
        return response.text
    except Exception as e:
        print("Gemini Error:", e)
        return (
            "⚠️ Gemini is currently unavailable due to high demand. "
            "Please try again in a few moments."
        )