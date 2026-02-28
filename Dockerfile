FROM python:3.12-slim

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code and pre-built frontend
COPY run.py .
COPY app/ ./app/
COPY static/ ./static/

# Copy env example as default env (override at runtime)
COPY .env.example .env

# Persistent data directory — mount a volume here so the SQLite DB
# (and any uploaded files) survive container restarts and redeployments.
RUN mkdir -p /data
VOLUME /data

# PORT env var — Railway / Render inject it at runtime; default to 8000
ENV PORT=8000

EXPOSE $PORT

CMD ["python", "run.py"]
