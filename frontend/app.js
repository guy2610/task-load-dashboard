const API_URL = "http://127.0.0.1:8000/api/tasks";

const totalTasksElement = document.getElementById("totalTasks");
const backendTimeElement = document.getElementById("backendTime");
const apiRoundTripTimeElement = document.getElementById("apiRoundTripTime");
const renderTimeElement = document.getElementById("renderTime");
const tableBodyElement = document.getElementById("tasksTableBody");
const loadingMessageElement = document.getElementById("loadingMessage");
const errorMessageElement = document.getElementById("errorMessage");
const reloadButtonElement = document.getElementById("reloadButton");

async function loadTasks() {
    loadingMessageElement.classList.remove("hidden");
    errorMessageElement.classList.add("hidden");
    tableBodyElement.innerHTML = "";

    totalTasksElement.textContent = "-";
    backendTimeElement.textContent = "-";
    apiRoundTripTimeElement.textContent = "-";
    renderTimeElement.textContent = "-";

    try {
        const requestStart = performance.now();
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const requestEnd = performance.now();

        const renderStart = performance.now();
        renderTasks(data.tasks);
        const renderEnd = performance.now();

        totalTasksElement.textContent = data.total;
        backendTimeElement.textContent = `${data.backendDurationMs} ms`;
        apiRoundTripTimeElement.textContent = `${(requestEnd - requestStart).toFixed(2)} ms`;
        renderTimeElement.textContent = `${(renderEnd - renderStart).toFixed(2)} ms`;
    } catch (error) {
        errorMessageElement.textContent = `שגיאה בטעינת המשימות: ${error.message}`;
        errorMessageElement.classList.remove("hidden");
    } finally {
        loadingMessageElement.classList.add("hidden");
    }
}

function renderTasks(tasks) {
    const fragment = document.createDocumentFragment();

    for (const task of tasks) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${task.taskId}</td>
            <td>${escapeHtml(task.title)}</td>
            <td>${task.status}</td>
            <td>${task.priority}</td>
        `;

        fragment.appendChild(row);
    }

    tableBodyElement.appendChild(fragment);
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

reloadButtonElement.addEventListener("click", loadTasks);

loadTasks();