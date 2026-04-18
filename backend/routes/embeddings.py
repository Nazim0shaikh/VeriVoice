from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.embedding_service import embedding_service
from services.firebase_service import firebase_service
import asyncio

router = APIRouter()

class EmbeddingRequest(BaseModel):
    id: str
    text: str

class DuplicateResponse(BaseModel):
    matched_id: str
    similarity_score: float
    confidence_level: str

@router.post("/check", response_model=List[DuplicateResponse])
async def check_duplicates(request: EmbeddingRequest):
    """
    Checks if a newly submitted complaint matches existing ones geographically or contextually.
    If yes, we flag it as a surge or duplicate in the database.
    """
    try:
        # Step 1: Create an embedding for the new complaint
        target_embedding = embedding_service.generate_embedding(request.text)
        
        # Step 2: Save the embedding back to the Firebase complaint document
        firebase_service.store_embedding(request.id, target_embedding)
        
        # Step 3: Fetch recent complaints to compare
        recent_complaints = firebase_service.get_recent_complaints(limit=100)
        
        matches = []
        for c in recent_complaints:
            # Skip itself
            if c.get("id") == request.id:
                continue
                
            stored_embedding = c.get("embedding")
            if stored_embedding:
                similarity = embedding_service.cosine_similarity(target_embedding, stored_embedding)
                
                if similarity > 0.85:
                    matches.append(DuplicateResponse(
                        matched_id=c.get("id", "UNKNOWN"),
                        similarity_score=similarity,
                        confidence_level="HIGH" if similarity > 0.92 else "MEDIUM"
                    ))
                    
        # Sort matches by highest similarity
        matches.sort(key=lambda x: x.similarity_score, reverse=True)
        return matches[:5]
        
    except Exception as e:
        print(f"Error checking duplicates: {e}")
        # In case of ML failure, fail gracefully
        return []

@router.post("/batch")
async def batch_embed():
    """Admin route to retroactively embed old complaints without vectors."""
    complaints = firebase_service.get_all_complaints()
    count = 0
    for c in complaints:
        if not c.get("embedding"):
            text = c.get("transcript", "") or c.get("summary", "")
            if text:
                emb = embedding_service.generate_embedding(text)
                firebase_service.store_embedding(c.get("id"), emb)
                count += 1
                await asyncio.sleep(0.1) # Prevent rate limiting
    
    return {"status": "success", "processed": count}
