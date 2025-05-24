document.addEventListener('DOMContentLoaded', () => {
    // HTML Element References
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    // Task Storage - will be populated from backend
    let tasks = [];

    // Render Tasks Function
    function renderTasks() {
        taskList.innerHTML = ''; // Clear existing tasks
        tasks.forEach(task => {
            const li = document.createElement('li');
            if (task.completed) {
                li.classList.add('completed');
            }
            li.setAttribute('data-id', task.id);

            const taskTextSpan = document.createElement('span');
            taskTextSpan.textContent = task.text;
            li.appendChild(taskTextSpan);

            const buttonContainer = document.createElement('div');

            const completeButton = document.createElement('button');
            completeButton.textContent = 'Completar';
            completeButton.className = 'complete-btn complete';
            completeButton.setAttribute('data-id', task.id);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.className = 'delete-btn';
            deleteButton.setAttribute('data-id', task.id);

            buttonContainer.appendChild(completeButton);
            buttonContainer.appendChild(deleteButton);
            li.appendChild(buttonContainer);
            taskList.appendChild(li);
        });
    }

    // Load Tasks from Backend
    async function loadTasks() {
        try {
            const response = await fetch('/api/tasks');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const fetchedTasks = await response.json();
            tasks.length = 0; // Clear current tasks
            tasks.push(...fetchedTasks); // Add new tasks from backend
            renderTasks();
        } catch (error) {
            console.error('Failed to load tasks:', error);
            // Optionally, display an error message to the user in the UI
            taskList.innerHTML = '<li>Error al cargar tareas. Por favor, intente más tarde.</li>';
        }
    }

    // Add Task Functionality (using Backend)
    async function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('El texto de la tarea no puede estar vacío.'); // Simple validation
            return;
        }

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: taskText })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
            }
            const newTask = await response.json();
            tasks.push(newTask); // Add to local array
            renderTasks();
            taskInput.value = ''; // Clear input field
        } catch (error) {
            console.error('Failed to add task:', error);
            alert(`Error al agregar tarea: ${error.message}`);
        }
    }

    // Event Listener for Add Task Button
    if (addTaskButton) {
        addTaskButton.addEventListener('click', addTask); // addTask is now async
    } else {
        console.error("Error: Botón de agregar tarea no encontrado. ID 'addTaskButton'");
    }
    
    // Event Listeners for Task Actions (Complete/Delete) using Backend
    if (taskList) {
        taskList.addEventListener('click', async (event) => { // Made async
            const target = event.target;
            if (target.tagName !== 'BUTTON' || !target.hasAttribute('data-id')) {
                return; // Click was not on a relevant button
            }

            const taskId = parseInt(target.getAttribute('data-id'));
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex === -1) {
                console.error('Task not found in local tasks array for ID:', taskId);
                return;
            }
            const taskToUpdate = tasks[taskIndex];

            try {
                if (target.classList.contains('delete-btn')) {
                    const response = await fetch(`/api/tasks/${taskId}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
                    }
                    tasks.splice(taskIndex, 1); // Remove from local array
                    renderTasks();

                } else if (target.classList.contains('complete-btn')) {
                    const newCompletedStatus = !taskToUpdate.completed;
                    const response = await fetch(`/api/tasks/${taskId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ completed: newCompletedStatus })
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
                    }
                    const updatedTaskFromServer = await response.json();
                    tasks[taskIndex] = updatedTaskFromServer; // Update local array
                    renderTasks();
                }
            } catch (error) {
                console.error('Failed to update/delete task:', error);
                alert(`Error al procesar la tarea: ${error.message}`);
                // Optionally, reload tasks to ensure UI consistency if an operation fails partially
                // loadTasks(); 
            }
        });
    } else {
        console.error("Error: Lista de tareas no encontrada. ID 'taskList'");
    }

    // Initial load of tasks from backend
    loadTasks();
});
