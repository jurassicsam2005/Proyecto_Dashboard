/* ===============================
   1. SELECCIONAR ELEMENTOS DEL DOM
   =============================== */

/*
JavaScript primero debe localizar los elementos
con los que va a trabajar dentro de la página.
*/

// Campo donde el usuario escribe la tarea
const input = document.getElementById("taskInput");

// Botón para agregar tarea
const button = document.getElementById("addTaskBtn");

// Contenedor donde aparecerán las tareas
const taskList = document.getElementById("taskList");

//Elementos de total de tareas
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progressTasks = document.getElementById("progress");

//Botones de ordenamiento
const sortAZ = document.getElementById("sortAZ");
const sortZA = document.getElementById("sortZA");

/* ===============================
   2. ESCUCHAR EVENTO DEL BOTÓN
   =============================== */
//Boton AZ
sortAZ.addEventListener("click", function() {
   console.log("Boton AZ pressed")
   const tasks = Array.from( document.querySelectorAll(".task-item") );

   tasks.sort(function(a,b) {
      const textA = a.querySelector("span").textContent.toLowerCase();
      const textB = b.querySelector("span").textContent.toLowerCase();
      
      return textA.localeCompare(textB);
   });

   taskList.innerHTML = "";

   tasks.forEach(function(task) {
      taskList.appendChild(task);
   });

});

sortZA.addEventListener("click", function() {
   const tasks = Array.from( document.querySelectorAll(".task-item"));

   tasks.sort(function(primerPalabra, segundaPalabra) {
      const textA = primerPalabra.querySelector("span").textContent.toLowerCase();
      const textB = segundaPalabra.querySelector("span").textContent.toLowerCase();

      return textB.localeCompare(textA);
   });

   taskList.innerHTML = "";

   tasks.forEach(function(task){
      taskList.appendChild(task);
   });
});

/*
addEventListener permite ejecutar código
cuando ocurre una acción del usuario.
*/

button.addEventListener("click", function() {
    createTask();
});

input.addEventListener("keypress", function(tecla) {
   if(tecla.key === "Enter") {
      createTask();
   }
});

function updateStats() {
   const tasks = document.querySelectorAll(".task-item");
   const completed = document.querySelectorAll(".task-item.completed");

   const total = tasks.length;
   const done = completed.length;

   totalTasks.textContent = total;
   completedTasks.textContent = done;
   pendingTasks.textContent = total - done;

   let porcentaje = 0;
   if(total > 0) {
      const resultado = (done / total) * 100
      porcentaje = Math.round(resultado);
   }

   progressTasks.textContent = porcentaje + "%"
}

function createTask() {
   //Guardamos el texto que escribio el usuario
    const taskText = input.value;
    console.log(taskText);

    if (taskText === "" ) return;

    //Crear elemento de tarea
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    const taskLeft = document.createElement("div");
    taskLeft.classList.add("task-left");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const span = document.createElement("span");
    span.textContent = taskText;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.classList.add("delete-btn");

    deleteButton.addEventListener("click", function() {
      taskItem.remove();
      updateStats();
    });

    deleteButton.addEventListener("click", function(){
        const confirmar = confirm("¿Seguro que quieres eliminar esta tarea?");

        if(confirmar) {
            taskItem.remove();
            updateStats();
        }
    });

    checkbox.addEventListener("change", function() {
      taskItem.classList.toggle("completed")

      if(checkbox.checked) {
         taskList.appendChild(taskItem); 
      } else {
         taskList.prepend(taskItem);
      }
      updateStats();
    })

    //Estructura HTML de cada tarea
    taskLeft.appendChild(checkbox);
    taskLeft.appendChild(span);

    taskItem.appendChild(taskLeft);
    taskItem.appendChild(deleteButton);

    //Insertar el texto dentro del elemento
    //taskItem.textContent = taskText;

    //Agregar la tarea al Dashboard
    taskList.appendChild(taskItem)

    //Limpiar input
    input.value = "";

    updateStats();
}

//Boton para completar todas las tareas
//Validacion de tareas 
function validarTarea(texto) {
  // Elimina espacios al inicio y al final
  let limpio = texto.trim();

  if (limpio.length < 5) {
    alert("El texto de la tarea es demasiado corto. Debe tener mínimo 5 caracteres.");
    return false;
  } else {
    return true;
  }
}

// Ejemplo de uso
validarTarea("  Hola "); // Mostrará alerta porque "Hola" tiene solo 4 caracteres
validarTarea("  Hola mundo "); // Pasará la validación

//Alerta de eliminacion
function eliminarTarea(id) {
  // Preguntar al usuario si está seguro
  let seguro = confirm("¿Estás seguro de que deseas eliminar esta tarea?");

  if (seguro) {
    // Aquí iría la lógica para eliminar la tarea
    console.log("Tarea eliminada con ID:", id);
  } else {
    // Si el usuario cancela, no se elimina
    console.log("Eliminación cancelada");
  }
}

// Ejemplo de uso
eliminarTarea(1);

//Agregar fecha de creacion
function crearTarea(texto) {
  let limpio = texto.trim();

  if (limpio.length < 5) {
    alert("El texto de la tarea es demasiado corto. Debe tener mínimo 5 caracteres.");
    return null;
  }

  // Crear objeto Date con la fecha actual
  let fechaCreacion = new Date();

  // Guardar tarea con texto y fecha
  let tarea = {
    texto: limpio,
    fecha: fechaCreacion.toLocaleString() // formato legible
  };

  console.log("Tarea creada:", tarea);
  return tarea;
}

// Ejemplo de uso
crearTarea("Estudiar JavaScript");



