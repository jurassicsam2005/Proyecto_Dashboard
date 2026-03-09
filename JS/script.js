// Obtener elementos del HTML
const input = document.getElementById('taskInput');
const button = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

//Evento del boton Agregar
button.addEventListener('click', function() {
    const taskText = input.value;
    console.log(taskText);

    if (taskText === "") {
        return
    }

    const taksItem = document.createElement('div');
    taksItem.classList.add('task-item'); 
    taksItem.textContent = taskText;

    taskList.appendChild(taksItem); 

    input.value = "";

    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.classList.add('complete-button');
    taksItem.appendChild(checkbox);
    
});

