let allTodos = JSON.parse(window.localStorage.getItem("allTodos") || "[]");
let filter = window.localStorage.getItem("filter") || "all";

const save = () => {
  const allTodosAsString = JSON.stringify(allTodos);
  window.localStorage.setItem("allTodos", allTodosAsString);
  window.localStorage.setItem("filter", filter);
};

// Handling form submition (adding new todo)
const todoForm = document.querySelector("#todoForm");
todoForm.addEventListener("submit", function (e) {
  filter = "all";
  const newTask = { text: todoForm.elements.task.value, isCompleted: false };
  todoForm.elements.task.value = "";
  allTodos.push(newTask);
  renderAllTodos();
  save();
  e.preventDefault();
});

//Rendering of each new todo
function renderTodo(newTask) {
  const newOl = document.createElement("li");
  newOl.className = "todo";

  const switchBar = document.createElement("label");
  switchBar.className = "switch";
  newOl.prepend(switchBar);

  const tick = document.createElement("input");
  tick.className = "tick";
  tick.setAttribute("type", "checkbox");

  if (newTask.isCompleted) {
    newOl.className = "todo checked";
    tick.setAttribute("checked", "checked");
  }

  switchBar.appendChild(tick);
  tick.addEventListener("change", function () {
    let changedTodo = { text: newTask.text, isCompleted: tick.checked };
    const todoIndexTickTwo = allTodos.indexOf(newTask);
    allTodos.splice(todoIndexTickTwo, 1, changedTodo);
    renderAllTodos();
    save();
  });

  const CheckBox = document.createElement("span");
  CheckBox.className = "custom-checkbox";
  switchBar.appendChild(CheckBox);

  const todoText = document.createElement("div");
  todoText.className = "todo-text";
  newOl.append(todoText);
  todoText.append(`${newTask.text}`);

  const DeleteButton = document.createElement("button");
  DeleteButton.className = "delete";
  newOl.append(DeleteButton);
  DeleteButton.addEventListener("click", function () {
    const todoIndex = allTodos.indexOf(newTask);
    allTodos.splice(todoIndex, 1);
    renderAllTodos();
    save();
  });

  const svG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svG.classList.add("icon");
  svG.setAttribute("viewBox", "0 0 352 512");
  svG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  DeleteButton.append(svG);
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.classList.add("path");
  path.setAttribute(
    "d",
    "M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
  );
  svG.appendChild(path);
  const taskContainer = document.querySelector("#taskContainer");
  taskContainer.append(newOl);
}

// Creation of "All Button" , showing all todos on click
const allButton = document.getElementById("all");
allButton.addEventListener("click", function () {
  filter = "all";
  renderAllTodos();
  save();
});

// Creation of "Active Button" , showing active todos on click
const activeButton = document.getElementById("active");
activeButton.addEventListener("click", function () {
  filter = "active";
  renderAllTodos();
  save();
});

// Creation of "Completed Button" , showing completed todos on click
const completedButton = document.getElementById("completed");
completedButton.addEventListener("click", function () {
  filter = "completed";
  renderAllTodos();
  save();
});

// Creation of "Cleared Button" , clearing completed todos on click
const clearedButton = document.getElementById("cleared");
clearedButton.addEventListener("click", function () {
  const completedTodos = allTodos.filter(function (todo) {
    return todo.isCompleted == true;
  });

  for (let i = 0; i < completedTodos.length; i++) {
    const completedTodo = completedTodos[i];
    const todoIndex = allTodos.indexOf(completedTodo);
    allTodos.splice(todoIndex, 1);
  }
  renderAllTodos();
  save();
});

const todosCount = document.getElementById("todosCount");

// Rendering all types of todos
function renderAllTodos() {
  "use strict";
  const activeTodos = allTodos.filter(function (todo) {
    return todo.isCompleted == false;
  });
  const completedTodos = allTodos.filter(function (todo) {
    return todo.isCompleted == true;
  });

  allButton.className = "nav-buttons";
  activeButton.className = "nav-buttons";
  completedButton.className = "nav-buttons";

  let todosToRender;
  if (filter === "all") {
    todosToRender = allTodos;
    allButton.classList.add("active");
  } else if (filter === "active") {
    todosToRender = activeTodos;
    activeButton.classList.add("active");
  } else if (filter === "completed") {
    todosToRender = completedTodos;
    completedButton.classList.add("active");
  } else {
    throw new Error('incorrect value of filter, expected "all", "active" or "completed", got ' + filter);
  }

  document.querySelector("ul").innerHTML = "";
  for (let i = 0; i < todosToRender.length; i++) {
    const todoSObject = todosToRender[i];
    renderTodo(todoSObject);
  }

  todosCount.innerHTML = `${activeTodos.length} items left`;

  if (completedTodos.length == 0) {
    clearedButton.style.visibility = "hidden";
  } else {
    clearedButton.style.visibility = "visible";
  }
}
renderAllTodos();
