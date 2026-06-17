from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.predict import UserPredictModel
from app.schemas.predict import PredictRequest, PredictResponse
from app.services import openrouter

router = APIRouter()

@router.post("/", response_model=PredictResponse)
async def create_prediction(
    *,
    db: Session = Depends(deps.get_db),
    predict_in: PredictRequest,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create a new prediction for the current user using OpenRouter API.
    """
    # 1. Ask OpenRouter
    stats_dict = predict_in.model_dump()
    prediction_label = await openrouter.predict_placement(stats_dict)
    
    # 2. Save to database
    db_obj = UserPredictModel(
        **stats_dict,
        user_id=current_user.id,
        label=prediction_label
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    
    return db_obj

@router.get("/", response_model=List[PredictResponse])
def read_predictions(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve predictions history for the current user.
    """
    predictions = db.query(UserPredictModel).filter(
        UserPredictModel.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return predictions
