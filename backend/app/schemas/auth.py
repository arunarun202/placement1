from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: str = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserRegister(BaseModel):
    username: str
    password: str
    email: EmailStr
    first_name: str = ""
    last_name: str = ""

class UserResponse(BaseModel):
    id: int
    username: str
    email: str | None
    first_name: str
    last_name: str
    is_active: bool

    class Config:
        from_attributes = True
