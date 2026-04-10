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
sortAZ.addEventListener("click", function() {

   tasks.sort((a, b) => {
      return a.text.toLowerCase().localeCompare(b.text.toLowerCase());
   });

   renderTask();
});

sortZA.addEventListener("click", function() {

   tasks.sort((a, b) => {
      return b.text.toLowerCase().localeCompare(a.text.toLowerCase());
   });

   renderTask();
});

let tasks = [];

/* ===============================
   CREAR TAREA
=============================== */
function createTask() {
   const taskText = input.value;

   if (!validarTarea(taskText)) return;

   const newTask = {
      text: taskText.trim(),
      completed: false,
      date: new Date().toLocaleString()
   };

   tasks.push(newTask);
   input.value = "";

   savetask();
   renderTask();

}

function createTask() {
   const taskText = input.value.trim();

   if (!validarTarea(taskText)) return;

   // 🚫 Evitar duplicados
   const existe = tasks.some(t => t.text.toLowerCase() === taskText.toLowerCase());

   if (existe) {
      alert("Esta tarea ya existe");
      return;
   }

   const newTask = {
      text: taskText,
      completed: false,
      date: new Date().toLocaleString()
   };

   tasks.push(newTask);

   input.value = "";

   savetask();
   renderTask();
}

/* ===============================
   RENDERIZAR TAREAS
=============================== */
function renderTask() {
   taskList.innerHTML = "";

   tasks.forEach((task, index) => {

      const taskItem = document.createElement("div");
      taskItem.classList.add("task-item");

      const taskLeft = document.createElement("div");
      taskLeft.classList.add("task-left");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;

      const span = document.createElement("span");
      span.textContent = task.text;

      const fecha = document.createElement("small");
      fecha.textContent = ` (${task.date})`;
      fecha.style.color = "gray";

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";

      // ✅ Eliminar correctamente
      deleteButton.addEventListener("click", () => {
         if (confirm("¿Seguro que quieres eliminar esta tarea?")) {
            tasks.splice(index, 1);
            savetask();
            renderTask();
         }
      });

      // ✅ Marcar completado
      checkbox.addEventListener("change", () => {
         tasks[index].completed = checkbox.checked;
         savetask();
         renderTask();
      });

      taskLeft.appendChild(checkbox);
      taskLeft.appendChild(span);
      taskLeft.appendChild(fecha);

      taskItem.appendChild(taskLeft);
      taskItem.appendChild(deleteButton);

      taskList.appendChild(taskItem);
   });

   updateStats();
}

/* ===============================
   ESTADÍSTICAS
=============================== */
function getstats() {
   const total = tasks.length;
   const done = tasks.filter(t => t.completed).length;

   return {
      total,
      done,
      pending: total - done,
      porcentaje: total > 0 ? Math.round((done / total) * 100) : 0
   };
}

function updateStats() {
   const stats = getstats();

   totalTasks.textContent = stats.total;
   completedTasks.textContent = stats.done;
   pendingTasks.textContent = stats.pending;
   progressTasks.textContent = stats.porcentaje + "%";
}

function updateStats() {
   const stats = getstats();

   totalTasks.textContent = stats.total;
   completedTasks.textContent = stats.done;
   pendingTasks.textContent = stats.pending;
   progressTasks.textContent = stats.porcentaje + "%";

   // 🎨 CAMBIO DE COLOR
   if (stats.porcentaje < 50) {
      progressTasks.style.color = "red";
   } else {
      progressTasks.style.color = "green";
   }
}

/* ===============================
   VALIDACIÓN
=============================== */
function validarTarea(texto) {
  let limpio = texto.trim();

  if (limpio.length < 5) {
    alert("La tarea debe tener mínimo 5 caracteres");
    return false;
  }

  if (limpio.length > 50) {
    alert("La tarea no puede tener más de 50 caracteres");
    return false;
  }

  return true;
}

/* ===============================
   LOCAL STORAGE
=============================== */
function savetask() {
   localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTask() {
   const save = localStorage.getItem("tasks");
   if (save) {
      tasks = JSON.parse(save);
      renderTask();
   }
}

/* ===============================
   EVENTOS
=============================== */
button.addEventListener("click", createTask);

input.addEventListener("keypress", function(e) {
   if (e.key === "Enter") createTask();
});

/* ===============================
   INICIO
=============================== */
loadTask();

function validarTarea(texto) {
  let limpio = texto.trim();

  if (limpio.length < 5) {
    alert("La tarea debe tener mínimo 5 caracteres");
    return false;
  }

  if (limpio.length > 50) {
    alert("La tarea no puede tener más de 50 caracteres");
    return false;
  }

  return true;
}

// BOTONES
const deleteAllBtn = document.getElementById("deleteAll");
const markAllBtn = document.getElementById("markAll");
const unmarkAllBtn = document.getElementById("unmarkAll");

// 🧹 BORRAR TODAS
deleteAllBtn.addEventListener("click", () => {
   if (tasks.length === 0) {
      alert("No hay tareas para eliminar");
      return;
   }

   const confirmar = confirm("¿Seguro que quieres eliminar TODAS las tareas?");
   
   if (confirmar) {
      tasks = [];
      savetask();
      renderTask();
   }
});

// ✅ MARCAR TODAS
markAllBtn.addEventListener("click", () => {
   if (tasks.length === 0) {
      alert("No hay tareas");
      return;
   }

   tasks.forEach(t => t.completed = true);

   savetask();
   renderTask();
});

// ❌ DESMARCAR TODAS
unmarkAllBtn.addEventListener("click", () => {
   if (tasks.length === 0) {
      alert("No hay tareas");
      return;
   }

   tasks.forEach(t => t.completed = false);

   savetask();
   renderTask();
});




