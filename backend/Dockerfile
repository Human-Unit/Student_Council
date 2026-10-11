FROM python:3.13-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY pyproject.toml ./
COPY app ./app
RUN pip install --no-cache-dir .
COPY alembic.ini ./
COPY alembic ./alembic
RUN useradd --create-home --uid 10001 api
USER api
EXPOSE 8000
CMD ["sh", "-c", "alembic upgrade head && python -m app.db.init_db && exec uvicorn app.main:app --host 0.0.0.0 --port 8000"]
