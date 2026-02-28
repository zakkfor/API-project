"""
Конфігурація додатку
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Налаштування проекту"""
    PROJECT_NAME: str = "Bike House"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./app.db"
    SECRET_KEY: str = "change-this-to-a-random-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    SEED_USER_PASSWORD: str = "BikeHouse2025!"
    # Список адміністраторів у форматі "username:password,username2:password2"
    # Змінюй цю змінну на Railway/Render без редагування коду.
    # ⚠️ У продакшені обов'язково встанови ADMIN_CREDENTIALS з надійними паролями.
    ADMIN_CREDENTIALS: str = "alex123:123456,alex12345:qwertyu,max:123456"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True
    )


settings = Settings()
