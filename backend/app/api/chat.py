from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.chat import Chatbot
from app.schemas.chat import ChatRequest, ChatResponse
from app.services import openrouter

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat_interaction(
    *,
    db: Session = Depends(deps.get_db),
    chat_in: ChatRequest,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Send a message to the AI career assistant.
    """
    # Optional: save user's message to history here if needed
    # For now we'll just save the bot's response as per dbschema
    
    bot_response = await openrouter.chat_response(chat_in.history, chat_in.message)
    
    db_obj = Chatbot(message=bot_response)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    
    return db_obj

@router.get("/", response_model=List[ChatResponse])
def get_chat_history(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve chatbot interactions.
    """
    chats = db.query(Chatbot).offset(skip).limit(limit).all()
    return chats
