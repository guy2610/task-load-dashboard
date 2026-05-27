from pathlib import Path
import sqlite3

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "tasks.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def initialize_database() -> None:
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS tasks (
                TaskID INTEGER PRIMARY KEY AUTOINCREMENT,
                Title TEXT NOT NULL,
                Status TEXT NOT NULL CHECK (Status IN ('Pending', 'InProgress', 'Completed')),
                Priority TEXT NOT NULL CHECK (Priority IN ('Low', 'Medium', 'High'))
            )
            """
        )
        conn.commit()