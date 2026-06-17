from typing import Any
from fastapi import APIRouter, Depends, Form, UploadFile, File
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.profile import Profile
from app.schemas.auth import UserResponse

router = APIRouter()


@router.put("/", response_model=UserResponse)
def update_profile(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    username: str = Form(None),
    email: str = Form(None),
    bio: str = Form(None),
    avatar: UploadFile = File(None),
) -> Any:
    """
    Update the current user's profile.
    """
    if username:
        current_user.username = username
    if email:
        current_user.email = email

    # Update profile fields
    if current_user.profile is None:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
    else:
        profile = current_user.profile

    if bio is not None:
        profile.bio = bio

    # Handle avatar upload (save locally for now)
    if avatar and avatar.filename:
        import os
        import uuid
        upload_dir = "media/avatars"
        os.makedirs(upload_dir, exist_ok=True)
        ext = os.path.splitext(avatar.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        filepath = os.path.join(upload_dir, filename)
        content = avatar.file.read()
        with open(filepath, "wb") as f:
            f.write(content)
        profile.avatar = filepath

    db.commit()
    db.refresh(current_user)

    return current_user
