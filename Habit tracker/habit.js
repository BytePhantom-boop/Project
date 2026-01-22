function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
// Habit tracker code

let habits = [];

function loadHabits() {
    const rawData = localStorage.getItem('habits');

    try {
        habits = JSON.parse(rawData) || [];
        if (!Array.isArray(habits)) habits = [];
    } catch {
        habits = [];
    }
    habits = habits.filter(habit =>
        habit &&
        typeof habit.name === 'string' &&
        habit.name.trim() !== '' &&
        typeof habit.streak === 'number'
    );

    habits.forEach(habit => {
        if (!habit.doneDates) habit.doneDates = {};
        if (!habit.lastDone) habit.lastDone = null;
    });

    localStorage.setItem('habits', JSON.stringify(habits));
    renderHabits();
}

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

function renderHabits() {
    const list = document.getElementById('habit-list');
    list.innerHTML = '';

    const today = formatDate(new Date());

    habits.forEach(habit => {
        const li = document.createElement('li');
        li.className = 'habit-entry';
        li.dataset.id = habit.id;

        li.innerHTML = `
            <div class="habit-header">
                <div>
                    <span class="habit-name">${habit.name}</span>
                    <span class="habit-streak">Streak: ${habit.streak}</span>
                </div>
                <div class="habit-buttons">
                    <button class="mark-done-btn">Done Today</button>
                    <button class="delete-habit-btn">Delete</button>
                </div>
            </div>
            <div class="heatmap" id="heatmap-${habit.id}"></div>
        `;

        list.appendChild(li);

        if (habit.lastDone === today) {
            const doneBtn = li.querySelector('.mark-done-btn');
            doneBtn.textContent = 'Done';
            doneBtn.disabled = true;
        }

        drawHeatmap(habit);
    });
}

function drawHeatmap(habit) {
    const heatmap = document.getElementById(`heatmap-${habit.id}`);
    heatmap.innerHTML = '';

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 364);

    for (let i = 0; i < 365; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        const formatted = formatDate(currentDate);
        const cell = document.createElement('div');
        cell.className = 'day';

        if (habit.doneDates[formatted]) {
            cell.classList.add('done');
        }

        if (formatted === formatDate(new Date())) {
            cell.classList.add('today');
        }

        heatmap.appendChild(cell);
    }
}

// code to add new habit
document.getElementById('add-habit-btn').addEventListener('click', () => {
    const input = document.getElementById('new-habit-input');
    const name = input.value.trim();

    if (!name) return;

    habits.push({
        id: Date.now().toString(),
        name,
        streak: 0,
        lastDone: null,
        doneDates: {}
    });

    saveHabits();
    renderHabits();
    input.value = '';
});

//actions like done or delete for habits
document.getElementById('habit-list').addEventListener('click', e => {
    const li = e.target.closest('li');
    if (!li) return;

    const habit = habits.find(h => h.id === li.dataset.id);
    if (!habit) return;

    const today = formatDate(new Date());
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = formatDate(yesterdayDate);

    if (e.target.classList.contains('mark-done-btn')) {
        if (habit.lastDone === today) return;

        habit.streak = habit.lastDone === yesterday ? habit.streak + 1 : 1;
        habit.lastDone = today;
        habit.doneDates[today] = true;

        saveHabits();
        renderHabits();
    }

    if (e.target.classList.contains('delete-habit-btn')) {
        habits = habits.filter(h => h.id !== habit.id);
        saveHabits();
        renderHabits();
    }
});
// Todo list logic
let tasks = [];

function loadTasks() {
    try {
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        if (!Array.isArray(tasks)) tasks = [];
    } catch {
        tasks = [];
    }

    tasks = tasks.filter(task =>
        task &&
        typeof task.name === 'string' &&
        task.name.trim() !== '' &&
        typeof task.completed === 'boolean'
    );

    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    const list = document.getElementById('task-list');
    list.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.dataset.id = task.id;

        if (task.completed) {
            li.classList.add('completed');
        }

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-label" contenteditable="true">${task.name}</span>
            <button class="remove-btn">&times;</button>
        `;

        list.appendChild(li);
    });
}

// Add task
document.getElementById('add-task-btn').addEventListener('click', () => {
    const input = document.getElementById('new-task-input');
    const name = input.value.trim();

    if (!name) return;

    tasks.push({
        id: Date.now().toString(),
        name,
        completed: false
    });

    saveTasks();
    renderTasks();
    input.value = '';
});

// Task interactions
document.getElementById('task-list').addEventListener('click', e => {
    const li = e.target.closest('li');
    if (!li) return;

    const task = tasks.find(t => t.id === li.dataset.id);
    if (!task) return;

    if (e.target.classList.contains('task-checkbox')) {
        task.completed = e.target.checked;
        saveTasks();
        li.classList.toggle('completed', task.completed);
    }

    if (e.target.classList.contains('remove-btn')) {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
    }
});

document.getElementById('task-list').addEventListener('input', e => {
    if (!e.target.classList.contains('task-label')) return;

    const li = e.target.closest('li');
    const task = tasks.find(t => t.id === li.dataset.id);

    if (task) {
        task.name = e.target.textContent.trim();
        saveTasks();
    }
});
// Pomodoro timer

let timerInterval = null;
let isRunning = false;
let isBreak = false;
let minutes = 0;
let seconds = 0;

function updateDisplay() {
    document.getElementById('timer-display').textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    if (isRunning) return;

    const workInput = document.getElementById('pomodoro-duration-input');
    const breakInput = document.getElementById('break-duration-input');

    const workMinutes = parseInt(workInput.value) || 25;
    const breakMinutes = parseInt(breakInput.value) || 5;

    minutes = isBreak ? breakMinutes : workMinutes;
    seconds = 0;

    isRunning = true;
    document.getElementById('start-timer-btn').disabled = true;

    timerInterval = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timerInterval);
                isRunning = false;

                if (!isBreak) {
                    alert("Work session complete! Break time.");
                    isBreak = true;
                } else {
                    alert("Break over! Back to work.");
                    isBreak = false;
                }

                document.getElementById('start-timer-btn').disabled = false;
                updateDisplay();
                return;
            }

            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }

        updateDisplay();
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isBreak = false;

    document.getElementById('start-timer-btn').disabled = false;

    const workMinutes = parseInt(
        document.getElementById('pomodoro-duration-input').value
    ) || 25;

    minutes = workMinutes;
    seconds = 0;
    updateDisplay();
}

document.getElementById('start-timer-btn').addEventListener('click', startTimer);
document.getElementById('reset-timer-btn').addEventListener('click', resetTimer);
// To load content on loading the page

document.addEventListener('DOMContentLoaded', () => {
    loadHabits();
    loadTasks();

    minutes = parseInt(
        document.getElementById('pomodoro-duration-input').value
    ) || 25;

    seconds = 0;
    updateDisplay();
});

document.addEventListener('DOMContentLoaded', () => {
    loadHabits();
    loadTasks();
    updateDisplay(workMinutes, 0);
});
