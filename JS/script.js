/* ===============================
   1. SELECCIONAR ELEMENTOS DEL DOM
   =============================== */
const input = document.getElementById("taskInput");
const category = document.getElementById("taskCategory");
const button = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const toggleBtn = document.getElementById("toggleDarkMode");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progressTasks = document.getElementById("progress");

// Botones
const sortAZ = document.getElementById("sortAZ");
const sortZA = document.getElementById("sortZA");
const deleteAllBtn = document.getElementById("deleteAll");
const markAllBtn = document.getElementById("markAll");
const unmarkAllBtn = document.getElementById("unmarkAll");

let tasks = [];

/* ===============================
   CREAR TAREA
=============================== */
function createTask() {
   const taskText = input.value.trim();

   if (!validarTarea(taskText)) return;

   const existe = tasks.some(t => t.text.toLowerCase() === taskText.toLowerCase());
   if (existe) {
      alert("Esta tarea ya existe");
      return;
   } 

   const newTask = {
   text: taskText,
   category: category.value, // ✅ NUEVO
   priority: document.getElementById("taskPriority").value, // ✅ NUEVO
   completed: false,
   date: new Date().toLocaleString()
};

   tasks.push(newTask); // ✅ AGREGAR AL ARRAY
   savetask();
   renderTask();

   input.value = ""; // limpiar input
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

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;

      const span = document.createElement("span");
      span.textContent = task.text;

      const categoria = document.createElement("small");
      categoria.textContent = ` [${task.category}]`;

      const fecha = document.createElement("small");
      fecha.textContent = ` (${task.date})`;

      const prioridad = document.createElement("small");
      prioridad.textContent = ` (${task.priority})`;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";

      const editButton = document.createElement("button");
      editButton.textContent = "Editar";

      // ✅ COMPLETADO
      if (task.completed) {
         taskItem.classList.add("completed");
      }

      checkbox.addEventListener("change", () => {
         tasks[index].completed = checkbox.checked;
         savetask();
         renderTask();
      });

      // ✅ ELIMINAR
      deleteButton.addEventListener("click", () => {
         if (confirm("¿Seguro que quieres eliminar esta tarea?")) {
            tasks.splice(index, 1);
            savetask();
            renderTask();
         }
      });

      // ✅ EDITAR
      editButton.addEventListener("click", () => {
         const inputEdit = document.createElement("input");
         inputEdit.type = "text";
         inputEdit.value = task.text;

         taskLeft.replaceChild(inputEdit, span);
         inputEdit.focus();

         inputEdit.addEventListener("blur", () => {
            const nuevoTexto = inputEdit.value.trim();

            if (validarTarea(nuevoTexto)) {
               tasks[index].text = nuevoTexto;
               savetask();
            }

            renderTask();
         });
      });

      taskLeft.appendChild(checkbox);
      taskLeft.appendChild(span);
      taskLeft.appendChild(categoria);
      taskLeft.appendChild(prioridad);
      taskLeft.appendChild(fecha);

      taskItem.appendChild(taskLeft);
      taskItem.appendChild(editButton);   // ✅ AÑADIDO
      taskItem.appendChild(deleteButton);

      if (task.priority === "Alta") {
        taskItem.style.borderLeft = "5px solid red";
      } else if (task.priority === "Media") {
         taskItem.style.borderLeft = "5px solid orange";
      } else {
         taskItem.style.borderLeft = "5px solid green";
      }

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

   // 🎨 CAMBIO DE COLOR
   progressTasks.style.color = stats.porcentaje < 50 ? "red" : "green";
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

sortAZ.addEventListener("click", function() {
   tasks.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
   renderTask();
});

sortZA.addEventListener("click", function() {
   tasks.sort((a, b) => b.text.toLowerCase().localeCompare(a.text.toLowerCase()));
   renderTask();
});

//  BORRAR TODAS
deleteAllBtn.addEventListener("click", () => {
   if (tasks.length === 0) {
      alert("No hay tareas para eliminar");
      return;
   }

   if (confirm("¿Seguro que quieres eliminar TODAS las tareas?")) {
      tasks = [];
      savetask();
      renderTask();
   }
});

//  MARCAR TODAS
markAllBtn.addEventListener("click", () => {
   if (tasks.length === 0) {
      alert("No hay tareas");
      return;
   }

   tasks.forEach(t => t.completed = true);
   savetask();
   renderTask();
});

//  DESMARCAR TODAS
unmarkAllBtn.addEventListener("click", () => {
   if (tasks.length === 0) {
      alert("No hay tareas");
      return;
   }

   tasks.forEach(t => t.completed = false);
   savetask();
   renderTask();
});

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("modo", "oscuro");
    } else {
        localStorage.setItem("modo", "claro");
    }
});

window.addEventListener("load", () => {
    const modoGuardado = localStorage.getItem("modo");

    if (modoGuardado === "oscuro") {
        document.body.classList.add("dark-mode");
    }
});

/* ===============================
   INICIO
=============================== */
loadTask();











