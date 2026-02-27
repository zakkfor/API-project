"""
Ендпоінт для завантаження зображень велосипедів
"""
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

from app.core.security import get_current_active_user

router = APIRouter(prefix="/upload", tags=["upload"])

UPLOAD_DIR = Path(__file__).resolve().parents[4] / "static" / "uploads"
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
_EXT_MAP = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif"}
MAX_SIZE = 5 * 1024 * 1024  # 5 МБ


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    _current_user=Depends(get_current_active_user),
):
    """Завантаження зображення велосипеда. Повертає URL збереженого файлу."""
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Дозволені формати: JPEG, PNG, WebP, GIF",
        )

    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="Файл занадто великий (макс 5 МБ)")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    ext = _EXT_MAP.get(file.content_type, "jpg")
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = UPLOAD_DIR / filename

    with open(filepath, "wb") as f:
        f.write(contents)

    return {"url": f"/static/uploads/{filename}"}
