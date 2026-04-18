from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from services.claude_service import claude_service

router = APIRouter()

class ComplaintRequest(BaseModel):
    complaintId: str
    text: str
    language: Optional[str] = None

@router.post("/classify")
async def classify_complaint_endpoint(request: ComplaintRequest):
    if not request.text:
        raise HTTPException(status_code=400, detail="Complaint text is required.")
        
    try:
        result = claude_service.classify_complaint(
            text=request.text, 
            language=request.language
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
