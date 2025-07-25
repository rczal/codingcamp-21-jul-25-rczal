let tasks = [];
let filteredDate = null;
let sortMode = 'alpha';
let sortDirection = {
    alpha: 'asc',
    date: 'asc'
};

document.addEventListener('DOMContentLoaded', renderTasks);

function toggleFilterPanel() {
    const panel = document.getElementById('filter-panel-content');
    const toggleText = document.getElementById('filter-panel-toggle-text');

    const isActive = panel.classList.contains('active-panel');

    if (isActive) {
        panel.classList.remove('active-panel');
        toggleText.innerHTML = 'Sesuaikan filter tanggal &#9660;';
        panel.style.maxHeight = null;
    } else {
        panel.classList.add('active-panel');
        toggleText.innerHTML = 'Sembunyikan filter tanggal &#9650;';
        panel.style.maxHeight = panel.scrollHeight + "px";
    }
}

function applyDateFilter() {
    const filterInput = document.getElementById("filter-date");
    filteredDate = filterInput.value ? filterInput.value : null;
    renderTasks();
    toggleFilterPanel();
}

function setSortMode(mode) {
    if (sortMode === mode) {
        sortDirection[mode] = (sortDirection[mode] === 'asc') ? 'desc' : 'asc';
    } else {
        sortMode = mode;
        sortDirection.alpha = 'asc';
        sortDirection.date = 'asc';
        sortDirection[mode] = 'asc';
    }
    renderTasks();
}

function clearFilter() {
    filteredDate = null;
    const filterInput = document.getElementById("filter-date");
    if (filterInput) {
        filterInput.value = "";
    }
    renderTasks();
    toggleFilterPanel();
}

function addTask() {
    const taskInput = document.getElementById("todo-input");
    const dateInput = document.getElementById("date-input");

    if (taskInput.value.trim() === "" || dateInput.value.trim() === "") {
        alert("Mohon masukkan tugas dan tanggal.");
        return;
    }

    tasks.push({
        title: taskInput.value.trim(),
        date: dateInput.value.trim(),
    });

    taskInput.value = "";
    dateInput.value = "";

    renderTasks();
}

function removeAllTask() {
    if (confirm("Apakah Anda yakin ingin menghapus semua tugas?")) {
        tasks = [];
        renderTasks();
    }
}

function renderTasks() {
    const todoTableBody = document.getElementById("todo-table-body");
    todoTableBody.innerHTML = '';

    let displayTasks = [...tasks];

    document.getElementById('sort-task-icon').innerHTML = '';
    document.getElementById('sort-date-icon').innerHTML = '';

    if (sortMode === 'alpha') {
        displayTasks.sort((a, b) => {
            const comparison = a.title.localeCompare(b.title);
            return (sortDirection.alpha === 'asc') ? comparison : -comparison;
        });
        document.getElementById('sort-task-icon').innerHTML = sortDirection.alpha === 'asc' ? ' &uarr;' : ' &darr;';
    } else if (sortMode === 'date') {
        displayTasks.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            const comparison = dateA - dateB;
            return (sortDirection.date === 'asc') ? comparison : -comparison;
        });
        document.getElementById('sort-date-icon').innerHTML = sortDirection.date === 'asc' ? ' &uarr;' : ' &darr;';
    }

    if (filteredDate) {
        displayTasks = displayTasks.filter(t => t.date === filteredDate);
    }

    if (displayTasks.length === 0) {
        todoTableBody.innerHTML = `
            <tr>
                <td colspan="3" class="px-4 py-3 text-center text-gray-500 text-sm">Tidak ada tugas yang tersedia</td>
            </tr>
        `;
        return;
    }

    displayTasks.forEach((task) => {
        const originalIndex = tasks.findIndex(t => t.title === task.title && t.date === task.date);

        todoTableBody.innerHTML += `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 border-b border-gray-200 text-sm text-gray-900">${task.title}</td>
                <td class="px-4 py-3 border-b border-gray-200 text-sm text-gray-500">${task.date}</td>
                <td class="px-4 py-3 border-b border-gray-200 text-sm text-center">
                    <div class="flex gap-2 justify-center">
                        <button onclick="editTask(${originalIndex})" class="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm">Edit</button>
                        <button onclick="deleteTask(${originalIndex})" class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm">Hapus</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function deleteTask(index) {
    if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
        tasks.splice(index, 1);
        renderTasks();
    }
}

function editTask(index) {
    const taskToEdit = tasks[index];
    if (!taskToEdit) return;

    let newTitle = prompt("Edit judul tugas:", taskToEdit.title);
    newTitle = newTitle ? newTitle.trim() : taskToEdit.title;

    let newDate = prompt("Edit tanggal tugas:", taskToEdit.date);
    newDate = newDate ? newDate.trim() : taskToEdit.date;

    if (newTitle !== taskToEdit.title || newDate !== taskToEdit.date) {
        tasks[index].title = newTitle;
        tasks[index].date = newDate;
        renderTasks();
    }
}