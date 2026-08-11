from pydantic import BaseModel, EmailStr


class RegisterUser(BaseModel):
    full_name: str
    email: EmailStr
    course: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str