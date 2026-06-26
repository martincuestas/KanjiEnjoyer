from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    secret_key: str = "dev-secret-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_days: int = 7

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
