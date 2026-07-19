from groq import Groq
from config import Config

client = Groq(api_key=Config.GROQ_API_KEY)


SYSTEM_PROMPT = """
You are an expert text summarizer.

Summarize the provided text into EXACTLY three concise bullet points.

Rules:
- Preserve only the most important information.
- No introductions.
- No conclusions.
- No numbering.
- Keep every bullet under 25 words.
- Return only the bullet points.
"""


def summarize_text(text: str):

    if not text.strip():
        raise ValueError("Input text cannot be empty.")

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",

        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": text
            }
        ],

        temperature=0.3,
        max_tokens=200
    )

    return response.choices[0].message.content