const todos = [];
const RENDER_EVENT = "render-todo";

function generateTodoObject(id, task, timestamp, isCompleted) {
  return {
    id,
    task,
    timestamp,
    isCompleted,
  };
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
  return -1;
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });
});

function addTodo() {
  const textTodo = document.getElementById("title").value;

  const timestamp = document.getElementById("date").value;

  const generateID = generateId();

  const todoObject = generateTodoObject(generateID, textTodo, timestamp, false);

  todos.push(todoObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(todos);
});

function makeTodo(todoObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = todoObject.task;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = todoObject.timestamp;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);

  container.setAttribute("id", `todo-${todoObject.id}`);

  if (todoObject.isCompleted) {
    const undoBtn = document.createElement("button");
    undoBtn.classList.add("undo-button");

    undoBtn.addEventListener("click", function () {
      undoTaskFromCompleted(todoObject.id);
    });

    const trashBtn = document.createElement("button");

    trashBtn.classList.add("trash-button");

    trashBtn.addEventListener("click", function () {
      removeTaskFromCompleted(todoObject.id);
    });

    container.append(undoBtn, trashBtn);
  } else {
    const checkBtn = document.createElement("button");
    checkBtn.classList.add("check-button");
    checkBtn.addEventListener("click", function () {
      addTaskToCompleted(todoObject.id);
    });
    container.append(checkBtn);
  }

  return container;
}

function removeTaskFromCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);
  if (todoTarget === -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);
  if (todoTarget == null) return;
  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addTaskToCompleted(todoId) {
  const todoTarget = findTodo(todoId);
  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function () {
  //   console.log(todos);
  const uncompletedTodoList = document.getElementById("todos");
  uncompletedTodoList.innerHTML = "";

  const completedTodoList = document.getElementById("completed-todos");
  completedTodoList.innerHTML = "";

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (!todoItem.isCompleted) {
      uncompletedTodoList.append(todoElement);
    } else {
      completedTodoList.append(todoElement);
    }
  }
});
