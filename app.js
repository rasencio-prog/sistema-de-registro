document.addEventListener('DOMContentLoaded', () => {
    // HTML Element References
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    // Task Storage
    let tasks = [];

    // Render Tasks Function
    function renderTasks() {
        taskList.innerHTML = ''; // Clear existing tasks
        tasks.forEach(task => {
            const li = document.createElement('li');
            if (task.completed) {
                li.classList.add('completed');
            }
            li.setAttribute('data-id', task.id); // Keep data-id on li for potential parent targeting

            const taskTextSpan = document.createElement('span');
            taskTextSpan.textContent = task.text;
            li.appendChild(taskTextSpan);

            const buttonContainer = document.createElement('div'); // Container for buttons

            // Complete Button
            const completeButton = document.createElement('button');
            completeButton.textContent = 'Completar';
            completeButton.className = 'complete-btn complete'; // Add 'complete' for styling, keep 'complete-btn' for JS
            completeButton.setAttribute('data-id', task.id);

            // Delete Button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.className = 'delete-btn'; // Keep 'delete-btn' for JS
            deleteButton.setAttribute('data-id', task.id);

            buttonContainer.appendChild(completeButton);
            buttonContainer.appendChild(deleteButton);
            li.appendChild(buttonContainer);
            taskList.appendChild(li);
        });
    }

    // Add Task Functionality
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const newTask = {
                text: taskText,
                completed: false,
                id: Date.now() // Unique ID for the task
            };
            tasks.push(newTask);
            taskInput.value = ''; // Clear input field
            renderTasks();
            saveTasks();
        }
    }

    // Save Tasks to LocalStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load Tasks from LocalStorage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        }
        renderTasks();
    }

    // Event Listener for Add Task Button
    if (addTaskButton) {
        addTaskButton.addEventListener('click', addTask);
    } else {
        console.error("Error: Botón de agregar tarea no encontrado. ID 'addTaskButton'");
    }
    

    // Event Listeners for Task Actions (Complete/Delete) using Event Delegation
    if (taskList) {
        taskList.addEventListener('click', (event) => {
            const target = event.target;
            // Ensure target is a button and has a data-id attribute
            if (target.tagName === 'BUTTON' && target.hasAttribute('data-id')) {
                const taskId = parseInt(target.getAttribute('data-id'));

                if (target.classList.contains('delete-btn')) {
                    tasks = tasks.filter(task => task.id !== taskId);
                } else if (target.classList.contains('complete-btn')) {
                    tasks = tasks.map(task => {
                        if (task.id === taskId) {
                            return { ...task, completed: !task.completed };
                        }
                        return task;
                    });
                }
                renderTasks();
                saveTasks();
            }
        });
    } else {
        console.error("Error: Lista de tareas no encontrada. ID 'taskList'");
    }

    // Initial load of tasks
    loadTasks();
});
