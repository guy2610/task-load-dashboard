# Environmental Tasks Assignment

A simple task dashboard assignment for the Ministry of Environmental Protection / Liacom.

The application loads thousands of generated tasks from a SQLite database, filters active tasks through a backend API, displays them in a browser, and shows timing measurements from both the backend and frontend.

## Features

- Generates at least 5,000 fake tasks
- Stores tasks in a local SQLite database
- Exposes a FastAPI backend
- Returns only tasks with status `Pending` or `InProgress`
- Skips tasks with status `Completed`
- Displays the returned tasks in a browser
- Shows the total number of returned tasks
- Measures backend execution time
- Measures frontend API roundtrip time
- Measures frontend render time
- Includes a paginated rendering mode as a performance-oriented improvement

## Tech Stack

Backend:

- Python 3.11
- FastAPI
- Uvicorn
- SQLite

Frontend:

- HTML
- CSS
- JavaScript

Database:

- SQLite
- Generated locally using a seed script

## Project Structure

```text
environmental-tasks-assignment/
├── backend/
│   ├── app.py
│   ├── database.py
│   └── seed_data.py
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── docs/
│   └── architecture.md
├── screenshots/
│   ├── database.png
│   └── running_app.png
├── README.md
├── requirements.txt
└── .gitignore
```

## Setup

Create and activate a virtual environment:

```bash
python3.11 -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## Generate the Database

Run the seed script from the project root:

```bash
python -m backend.seed_data
```

This creates a local SQLite database and inserts 5,000 generated tasks.

The generated database file is not committed to Git because it can be recreated at any time using the seed script.

## Run the Backend

From the project root, run:

```bash
uvicorn backend.app:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

## API Endpoints

### Health Check

```text
GET /health
```

Example:

```bash
curl http://127.0.0.1:8000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

### Get Active Tasks

```text
GET /api/tasks
```

Example:

```bash
curl http://127.0.0.1:8000/api/tasks
```

The endpoint returns only tasks whose status is:

- `Pending`
- `InProgress`

Tasks with status `Completed` are intentionally filtered out according to the assignment requirement.

Example response shape:

```json
{
  "tasks": [
    {
      "taskId": 1,
      "title": "Generated task #1",
      "status": "Pending",
      "priority": "High"
    }
  ],
  "total": 3334,
  "backendDurationMs": 8.42
}
```

## Run the Frontend

After starting the backend, open:

```text
frontend/index.html
```

You can open it directly in the browser or through the IDE.

The page displays:

- Task table
- Total number of returned tasks
- Backend execution time
- Frontend API roundtrip time
- Frontend render time

## Timing Measurements

The application displays three timing values.

### Backend Time

Measured inside the FastAPI backend.

This measures how long it takes the backend to query the SQLite database, build the response objects, and prepare the response.

### API Roundtrip Time

Measured in the browser.

This measures how long it takes from the moment the frontend sends the request until the response data is available in the browser.

### Render Time

Measured in the browser.

This measures how long it takes to render the task rows into the page.

## Rendering Modes

The frontend includes two display modes.

### Full Render

This is the default mode.

It renders all tasks returned by the backend and satisfies the assignment requirement to display the task list and measure browser render time.

### Paginated Mode

This is an additional improvement.

It displays 100 tasks per page while keeping the full dataset available in the frontend.

This demonstrates how the UI can reduce DOM load when working with thousands of rows.

The API still returns all active tasks. Pagination is only a frontend rendering optimization.

## Verify the Data

After running the seed script, the database contains 5,000 generated tasks.

You can verify it with:

```bash
python - <<'PY'
from backend.database import get_connection

with get_connection() as conn:
    total = conn.execute("SELECT COUNT(*) FROM tasks").fetchone()[0]
    active = conn.execute(
        "SELECT COUNT(*) FROM tasks WHERE Status IN ('Pending', 'InProgress')"
    ).fetchone()[0]

print("Total tasks:", total)
print("Pending/InProgress tasks:", active)
PY
```

Expected result:

```text
Total tasks: 5000
Pending/InProgress tasks: around 3300
```

The exact number of active tasks depends on the generated status distribution.

## Submission Notes

The submitted solution should include:

- All source code
- `README.md`
- `docs/architecture.md`
- `backend/seed_data.py`
- Screenshots of:
  - The database / task table
  - The running frontend after loading tasks

Suggested screenshots:

```text
screenshots/database.png
screenshots/running_app.png
```

Do not include local development artifacts such as:

- `.venv/`
- `.idea/`
- `__pycache__/`
- `.git/`

## Engineering Decisions and AI Usage

This project was implemented as a small, focused assignment solution with an emphasis on correctness, clear structure, and measurable behavior.

I chose Python with FastAPI for the backend because the assignment allowed Python, and this stack made it possible to keep the API simple, readable, and easy to run locally. SQLite was used as the local data source because it is lightweight, easy to inspect, and sufficient for storing and querying thousands of generated tasks.

The main implementation decisions were made manually, including:

- Using a seed script to generate the task dataset
- Filtering completed tasks in the backend according to the assignment requirements
- Returning the backend execution time as part of the API response
- Measuring browser API roundtrip time separately from browser render time
- Keeping the default view as a full render of all returned tasks
- Adding a paginated rendering mode as an optional frontend performance improvement

AI tools were used as a development assistant during the assignment. The main use was to speed up boilerplate, help with implementation details, review edge cases, and draft documentation.

The code was built incrementally, tested locally, reviewed manually, and committed in small Git commits after each stable step. The final structure, technology choices, API behavior, timing measurements, and submission content were validated manually.