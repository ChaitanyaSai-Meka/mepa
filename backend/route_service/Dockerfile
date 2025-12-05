FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml ./
RUN pip install uv && uv sync

COPY . .

EXPOSE 8001

CMD ["uv", "run", "python", "main.py"]
