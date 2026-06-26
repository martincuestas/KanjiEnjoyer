from pydantic import BaseModel, field_validator


class UserCreate(BaseModel):
    username: str
    password: str

    @field_validator("username")
    @classmethod
    def username_valid(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 3 or len(v) > 32:
            raise ValueError("El nombre de usuario debe tener entre 3 y 32 caracteres.")
        if not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError("Solo letras, números, guiones y guiones bajos.")
        return v

    @field_validator("password")
    @classmethod
    def password_valid(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("La contraseña debe tener al menos 6 caracteres.")
        return v


class UserLogin(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserPublic(BaseModel):
    id: int
    username: str
    current_generation: int

    model_config = {"from_attributes": True}
