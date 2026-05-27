const API_URL = "http://127.0.0.1:8000/api/tasks";
const PAGE_SIZE = 100;

const totalTasksElement = document.getElementById("totalTasks");
const backendTimeElement = document.getElementById("backendTime");
const apiRoundTripTimeElement = document.getElementById("apiRoundTripTime");
const renderTimeElement = document.getElementById("renderTime");
const tableBodyElement = document.getElementById("tasksTableBody");
const loadingMessageElement = document.getElementById("loadingMessage");
const errorMessageElement = document.getElementById("errorMessage");
const reloadButtonElement = document.getElementById("reloadButton");

const renderModeElement = document.getElementById("renderMode");
const paginationControlsElement = document.getElementById("paginationControls");
const previousPageButtonElement = document.getElementById("previousPageButton");
const nextPageButtonElement = document.getElementById("nextPageButton");
const pageInfoElement = document.getElementById("pageInfo");

let allTasks = [];
let currentPage = 1;
let currentBackendDurationMs = null;
let currentApiRoundTripMs = null;

async function loadTasks() {
    loadingMessageElement.classList.remove("hidden");
    errorMessageElement.classList.add("hidden");
    tableBodyElement.innerHTML = "";

    resetMetrics();

    try {
        const requestStart = performance.now();
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const requestEnd = performance.now();

        allTasks = data.tasks;
        currentPage = 1;
        currentBackendDurationMs = data.backendDurationMs;
        currentApiRoundTripMs = requestEnd - requestStart;

        renderCurrentView();
    } catch (error) {
        errorMessageElement.textContent = `שגיאה בטעינת המשימות: ${error.message}`;
        errorMessageElement.classList.remove("hidden");
    } finally {
        loadingMessageElement.classList.add("hidden");
    }
}

function renderCurrentView() {
    const renderStart = performance.now();

    const mode = renderModeElement.value;
    const visibleTasks = mode === "paginated"
        ? getCurrentPageTasks()
        : allTasks;

    renderTasks(visibleTasks);

    const renderEnd = performance.now();

    totalTasksElement.textContent = allTasks.length;
    backendTimeElement.textContent = `${currentBackendDurationMs} ms`;
    apiRoundTripTimeElement.textContent = `${currentApiRoundTripMs.toFixed(2)} ms`;
    renderTimeElement.textContent = `${(renderEnd - renderStart).toFixed(2)} ms`;

    updatePaginationControls();
}

function getCurrentPageTasks() {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    return allTasks.slice(startIndex, endIndex);
}

function renderTasks(tasks) {
    tableBodyElement.innerHTML = "";

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

function updatePaginationControls() {
    const mode = renderModeElement.value;

    if (mode !== "paginated") {
        paginationControlsElement.classList.add("hidden");
        return;
    }

    const totalPages = Math.max(1, Math.ceil(allTasks.length / PAGE_SIZE));

    paginationControlsElement.classList.remove("hidden");
    pageInfoElement.textContent = `עמוד ${currentPage} מתוך ${totalPages}`;

    previousPageButtonElement.disabled = currentPage === 1;
    nextPageButtonElement.disabled = currentPage === totalPages;
}

function resetMetrics() {
    totalTasksElement.textContent = "-";
    backendTimeElement.textContent = "-";
    apiRoundTripTimeElement.textContent = "-";
    renderTimeElement.textContent = "-";
    pageInfoElement.textContent = "עמוד -";
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

renderModeElement.addEventListener("change", () => {
    currentPage = 1;
    renderCurrentView();
});

previousPageButtonElement.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage -= 1;
        renderCurrentView();
    }
});

nextPageButtonElement.addEventListener("click", () => {
    const totalPages = Math.ceil(allTasks.length / PAGE_SIZE);

    if (currentPage < totalPages) {
        currentPage += 1;
        renderCurrentView();
    }
});

loadTasks();