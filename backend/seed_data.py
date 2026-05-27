import random

from backend.database import get_connection, initialize_database

TASK_COUNT = 5000

STATUSES = ["Pending", "InProgress", "Completed"]
PRIORITIES = ["Low", "Medium", "High"]


def seed_tasks() -> None:
    initialize_database()

    with get_connection() as conn:
        conn.execute("DELETE FROM tasks")
        conn.execute("DELETE FROM sqlite_sequence WHERE name = 'tasks'")

        rows = []
        for i in range(1, TASK_COUNT + 1):
            status = random.choice(STATUSES)
            priority = random.choice(PRIORITIES)
            title = f"Generated task #{i}"

            rows.append((title, status, priority))

        conn.executemany(
            """
            INSERT INTO tasks (Title, Status, Priority)
            VALUES (?, ?, ?)
            """,
            rows,
        )

        conn.commit()

    print(f"Seeded {TASK_COUNT} tasks into the database.")


if __name__ == "__main__":
    seed_tasks()