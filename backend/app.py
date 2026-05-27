from time import perf_counter

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import get_connection, initialize_database

app = FastAPI(title="Environmental Tasks Assignment API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    initialize_database()


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/tasks")
def get_active_tasks() -> dict:
    start_time = perf_counter()

    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT TaskID, Title, Status, Priority
            FROM tasks
            WHERE Status IN ('Pending', 'InProgress')
            ORDER BY TaskID ASC
            """
        ).fetchall()

    tasks = [
        {
            "taskId": row["TaskID"],
            "title": row["Title"],
            "status": row["Status"],
            "priority": row["Priority"],
        }
        for row in rows
    ]

    backend_duration_ms = (perf_counter() - start_time) * 1000

    return {
        "tasks": tasks,
        "total": len(tasks),
        "backendDurationMs": round(backend_duration_ms, 2),
    }