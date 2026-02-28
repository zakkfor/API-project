import asyncio
import logging
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.config import settings
from app.api.v1 import router as api_v1_router
from app.database import Base, engine
import app.models.user  # noqa: F401 — ensure models are registered
import app.models.bicycle  # noqa: F401 — ensure models are registered
from app.seed import seed_db

logger = logging.getLogger(__name__)


async def _init_db() -> None:
    """Initialise schema and seed data in a thread so the event loop is not blocked."""
    try:
        await asyncio.to_thread(Base.metadata.create_all, engine)
    except Exception:
        logger.exception("Failed to create database tables — app will start without a schema.")
        return
    try:
        await asyncio.to_thread(seed_db)
    except Exception:
        logger.exception("Failed to seed database — app will start without seed data.")


@asynccontextmanager
async def lifespan(application: FastAPI):
    """Fire DB init as a background task so uvicorn can start serving immediately."""
    task = asyncio.create_task(_init_db())
    try:
        yield
    finally:
        if not task.done():
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

static_path = Path(__file__).parent.parent / "static"
if static_path.exists():
    app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    api_v1_router.router,
    prefix=settings.API_V1_STR
)

@app.get("/", tags=["root"])
async def root():
    static_path = Path(__file__).parent.parent / "static"
    index_file = static_path / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    else:
        return {
            "message": f"Welcome to {settings.PROJECT_NAME}!",
            "docs": "/docs",
            "redoc": "/redoc",
            "web_ui": "Web interface not found"
        }

@app.get("/health", tags=["health"])
async def health_check() -> dict:
    return {"status": "healthy"}
