from sentence_transformers import SentenceTransformer
import numpy as np

class EmbeddingService:
    def __init__(self):
        # We load a small model optimized for latency and efficiency
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

    def generate_embedding(self, text: str) -> list:
        # Encode the text to an embedding vector
        embedding = self.model.encode(text, convert_to_tensor=False)
        return embedding.tolist()

    def cosine_similarity(self, v1: list, v2: list) -> float:
        # Calculate cosine similarity between two vectors
        vec1 = np.array(v1)
        vec2 = np.array(v2)
        if np.linalg.norm(vec1) == 0 or np.linalg.norm(vec2) == 0:
            return 0.0
            
        return float(np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2)))

embedding_service = EmbeddingService()
