from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    message: str
    
class ChatRequest(BaseModel):
    history: List[str] = []
    message: str

class ChatResponse(BaseModel):
    id: int
    message: str

    class Config:
        from_attributes = True
