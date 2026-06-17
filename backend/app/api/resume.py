import os
import uuid
from typing import Any, List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.resume import ResumeUpload
from app.schemas.resume import ResumeResponse
from app.services import openrouter, parser

router = APIRouter()

# For local development, we'll store uploads in a local media directory
MEDIA_DIR = "media/resumes"
os.makedirs(MEDIA_DIR, exist_ok=True)

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    *,
    db: Session = Depends(deps.get_db),
    file: UploadFile = File(...),
    job_role: str = Form(...),
    name: str = Form(...),
    email: str = Form(""),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Upload a resume and evaluate it against a job role using OpenRouter.
    """
    if not file.filename.lower().endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")

    # Read file content into memory
    file_content = await file.read()
    
    # Extract text
    resume_text = parser.extract_text(file_content, file.filename)
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the provided file.")

    # Evaluate with OpenRouter
    evaluation_result = await openrouter.evaluate_resume(resume_text, job_role)
    
    # Save the file to local media directory (temporary solution before cloud storage)
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(MEDIA_DIR, unique_filename)
    with open(file_path, "wb") as f:
        f.write(file_content)

    # Save to database
    db_obj = ResumeUpload(
        user_id=current_user.id,
        name=name,
        email=email,
        job_role=job_role,
        file=file_path,
        processed=True,
        ats_score=evaluation_result.get("ats_score", 0),
        suggestions=evaluation_result.get("suggestions", ""),
        course_products=evaluation_result.get("course_products", []),
        alternative_roles=evaluation_result.get("alternative_roles", []),
        role_courses=evaluation_result.get("role_courses", []),
        gemini_response=evaluation_result # Save the raw JSON as well
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    
    return db_obj

@router.get("/", response_model=List[ResumeResponse])
def read_resumes(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve resume history for the current user.
    """
    resumes = db.query(ResumeUpload).filter(
        ResumeUpload.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return resumes

@router.get("/{id}", response_model=ResumeResponse)
def read_resume(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get a specific resume by ID.
    """
    resume = db.query(ResumeUpload).filter(
        ResumeUpload.id == id,
        ResumeUpload.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@router.delete("/{id}")
def delete_resume(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete a specific resume by ID.
    """
    resume = db.query(ResumeUpload).filter(
        ResumeUpload.id == id,
        ResumeUpload.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Optionally delete the physical file
    if resume.file and os.path.exists(resume.file):
        try:
            os.remove(resume.file)
        except OSError:
            pass
            
    db.delete(resume)
    db.commit()
    return {"success": True}
