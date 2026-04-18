import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

MODEL_NAME = "z-ai/glm-5.1"

class AIService:
    def __init__(self):
        self.api_key = os.getenv("NVIDIA_API_KEY")
        if self.api_key:
            self.client = OpenAI(
                base_url="https://integrate.api.nvidia.com/v1",
                api_key=self.api_key
            )
        else:
            self.client = None

    def classify_complaint(self, text: str, language: str = None) -> dict:
        if not self.client:
            print("No NVIDIA_API_KEY found, falling back to mock classification.")
            return self._mock_classification(text)

        system_prompt = (
            "You are an AI assistant for a civic grievance system called VeriVoice. "
            "Your task is to classify civic complaints. Always return valid JSON only, without markdown formatting like ```json ... ```. "
            "The JSON must have the following keys: "
            "'category' (one of [Road, Water, Electricity, Sanitation, Corruption, Healthcare, Education, Other]), "
            "'severity' (integer 1-5, where 5 is most urgent), "
            "'department' (string: which government department should handle this), "
            "'summary' (string: one sentence summary in English regardless of input language), "
            "'language' (string: detected language of the complaint), "
            "'keywords' (array of strings: 3-5 keywords for searching)."
        )

        user_message = f"Complaint text:\n{text}"
        if language:
            user_message += f"\nHint: Language might be {language}."

        try:
            response = self.client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0,
                top_p=1,
                max_tokens=1024,
                extra_body={"chat_template_kwargs":{"enable_thinking":True,"clear_thinking":False}}
            )
            
            response_text = response.choices[0].message.content
            
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "", 1).replace("```", "").strip()
            elif response_text.startswith("```"):
                response_text = response_text.replace("```", "", 2).strip()
            
            classification = json.loads(response_text)
            return classification
            
        except Exception as e:
            print(f"NVIDIA API Error: {e}")
            return self._mock_classification(text)

    def _mock_classification(self, text: str = ""):
        # Fallback if no API key or rate limited
        text_lower = text.lower()
        category = "Other"
        department = "Municipal Corporation"
        
        if any(word in text_lower for word in ["road", "pothole", "street", "pavement"]):
            category = "Road"
            department = "Public Works Department"
        elif any(word in text_lower for word in ["water", "pipe", "leak", "drain", "sewage"]):
            category = "Water"
            department = "Water Authority"
        elif any(word in text_lower for word in ["electricity", "power", "light", "wire", "outage"]):
            category = "Electricity"
            department = "Electricity Board"
            
        return {
            "category": category,
            "severity": 3 if len(text) < 50 else 4,
            "department": department,
            "summary": text[:80] + "..." if len(text) > 80 else text or "A civic complaint requires attention.",
            "language": "English",
            "keywords": ["civic", "complaint", category.lower()]
        }

claude_service = AIService()
