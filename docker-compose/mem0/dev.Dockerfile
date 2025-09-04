FROM python:3.12-slim

WORKDIR /app

COPY mem0/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY mem0/ .

EXPOSE 8000

ENV PYTHONUNBUFFERED=1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
