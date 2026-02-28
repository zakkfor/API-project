"""
Entry point for running the FastAPI application.
Reads PORT from the environment directly so no shell variable expansion is needed.
Compatible with Railway, Render, and other platforms that may exec the start
command without a shell wrapper.
"""
import os
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, log_level="info")
