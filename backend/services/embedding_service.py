import os
import numpy as np
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class EmbeddingService:
    def __init__(self):
        self.api_key = os.getenv("NVIDIA_API_KEY")
        if self.api_key:
            self.client = OpenAI(
                base_url="https://integrate.api.nvidia.com/v1",
                api_key=self.api_key
            )
        else:
            self.client = None

    def generate_embedding(self, text: str) -> list:
        if not self.client:
            print("No NVIDIA_API_KEY found, returning zero vector.")
            return [0.0] * 1024 # Dummy vector length for nv-embedqa-e5-v5
            
        try:
            response = self.client.embeddings.create(
                input=[text],
                model="nvidia/nv-embedqa-e5-v5",
                encoding_format="float",
                extra_body={"input_type": "query", "truncate": "NONE"}
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"NVIDIA Embedding API Error: {e}")
            return [0.0] * 1024

    def cosine_similarity(self, v1: list, v2: list) -> float:
        # Calculate cosine similarity between two vectors
        vec1 = np.array(v1)
        vec2 = np.array(v2)
        if np.linalg.norm(vec1) == 0 or np.linalg.norm(vec2) == 0:
            return 0.0
            
        return float(np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2)))

embedding_service = EmbeddingService()
