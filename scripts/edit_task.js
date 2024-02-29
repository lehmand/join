let currentDialog = null;
let currentIndex = null;
let newTask = null;
let editSubtasksList = [];

async function openTaskDialog(id, index) {
  currentDialog = document.getElementById(id);
  currentDialog.setAttribute("data-task-index", index);
  currentIndex = index;
  newTask = { ...boardTasks[currentIndex] };

  renderDialog(index);
  openDialog(id);
}

function renderDialog(index) {
  document.getElementById("task-show-dialog").classList.remove("d-none");
  document.getElementById("task-edit-dialog").classList.add("d-none");

  renderTaskCategory(boardTasks[index].category);
  renderTaskTitle(boardTasks[index].title);
  renderTaskDescription(boardTasks[index].description);
  renderTaskDueDate(boardTasks[index].date);
  renderTaskPriority(boardTasks[index].priority);
  renderTaskAssignees(boardTasks[index].assignees);
  renderTaskSubtasks(boardTasks[index].subtasks);
}

/**
 * Renders the task category in the dialog.
 * @param {*} category - The category of the task to be rendered.
 */
function renderTaskCategory(category) {
  const dialogCategoryContainer = document.getElementById("dialog-show-category-container");
  const dialogCategoryElement = document.getElementById("dialog-show-category");

  let className = category.replace(/\s+/g, "-").toLowerCase();

  dialogCategoryContainer.classList.add(className);
  dialogCategoryElement.innerHTML = category;
}

/**
 * Renders the task description in the dialog.
 * @param {*} description - The description of the task to be rendered.
 */
function renderTaskDescription(description) {
  const dialogDescriptionElement = document.getElementById("dialog-show-description");
  dialogDescriptionElement.innerHTML = description;
}

/**
 * Renders the task title in the dialog.
 * @param {*} title - The title of the task to be rendered.
 */
function renderTaskTitle(title) {
  const dialogTitleElement = document.getElementById("dialog-show-title");
  dialogTitleElement.innerHTML = title;
}

/**
 * Renders the task due date in the dialog.
 * @param {*} date - The due date of the task to be rendered.
 */
function renderTaskDueDate(date) {
  const dialogDueDateElement = document.getElementById("dialog-show-due-date");
  dialogDueDateElement.innerHTML = date;
}

/**
 * Renders the task priority in the dialog.
 * @param {*} priority - The priority of the task to be rendered.
 */
function renderTaskPriority(priority) {
  const dialogPriorytyElement = document.getElementById("dialog-show-priority");
  dialogPriorytyElement.innerHTML = `${priority} <img src="assets/icons/priority=${priority}.svg" />`;
}

/**
 * Renders the task assignees in the dialog.
 * @param {*} assignees - An array containing the assignees of the task to be rendered.
 */
function renderTaskAssignees(assignees) {
  const dialogAssignedToContainer = document.getElementById("dialog-assigned-to-container");
  dialogAssignedToContainer.innerHTML = "";

  if (assignees.length === 0) {
    dialogAssignedToContainer.innerHTML = "This task is assigned to all of us.";
  } else {
    for (let i = 0; i < assignees.length; i++) {
      const assignee = assignees[i];
      const bgColor = assignColor(assignee);
      dialogAssignedToContainer.innerHTML += renderTaskAssigneeHtml(assignee, bgColor);
    }
  }
}

/**
 * Renders the task subtasks in the dialog.
 * @param {*} subtasks - An array containing the subtasks of the task to be rendered.
 */
function renderTaskSubtasks(subtasks) {
  const dialogSubtasksContainer = document.getElementById("dialog-subtasks-container");
  dialogSubtasksContainer.innerHTML = "";
  editSubtasksList = [];

  if (subtasks.length === 0) {
    dialogSubtasksContainer.innerHTML = "There are no subtasks assigned to this task.";
  } else {
    for (let i = 0; i < subtasks.length; i++) {
      const subtask = subtasks[i];
      editSubtasksList.push(subtask.name);
      dialogSubtasksContainer.innerHTML += renderTaskSubtaskHtml(i, subtask);
    }
  }
}

/**
 * Toggles the state (completed or not completed) of a subtask.
 * @param {*} index - The index of the subtask to toggle.
 */
async function toggleSubtaskState(index) {
  const taskIndex = currentDialog.getAttribute("data-task-index");
  const subtaskIndex = index;
  const currentState = boardTasks[taskIndex].subtasks[subtaskIndex].completed;

  if (currentState) {
    boardTasks[taskIndex].subtasks[subtaskIndex].completed = false;
  } else {
    boardTasks[taskIndex].subtasks[subtaskIndex].completed = true;
  }

  await saveTasks(boardTasks);
  renderBoard(boardTasks);
}

/**
 * Deletes the task currently being viewed in the dialog.
 * This function removes the task from the boardTasks array, saves the updated tasks,
 * renders the board with the updated tasks, closes the dialog, and displays a toast message.
 */
async function deleteTask() {
  let index = currentDialog.getAttribute("data-task-index");
  boardTasks.splice(index, 1);
  await saveTasks(boardTasks);
  renderBoard(boardTasks);
  closeDialogForce();
  showToast("Task deleted.");
}

// EDIT TASK // EDIT TASK // EDIT TASK
// EDIT TASK // EDIT TASK // EDIT TASK

function editTask() {
  let index = currentDialog.getAttribute("data-task-index");
  document.getElementById("task-show-dialog").classList.add("d-none");
  document.getElementById("task-edit-dialog").classList.remove("d-none");

  editTaskTitle(boardTasks[index].title);
  editTaskDescription(boardTasks[index].description);
  editTaskDialogAssignedToAvatars(boardTasks[index].assignees);
  editTaskDialogDueDate(boardTasks[index].date);
  editTaskChoseCategory(boardTasks[index].category);
  editTaskRenderAssignedTo();
  editTaskInitPriorityButtons();
  editRenderTaskSubtasksList(boardTasks[index].subtasks);
}

function editTaskInitPriorityButtons() {
  let priorityContainer = document.getElementById("edit-task-urgent-medium-low-buttons");
  let priorityButtons = priorityContainer.children;

  for (let i = 0; i < priorityButtons.length; i++) {
    const button = priorityButtons[i];

    if (button.dataset.priority == boardTasks[currentIndex].priority) {
      button.classList.add("add-task-clicked");
      button.children[0].children[1].src = `./assets/icons/priority=${button.dataset.priority}_white.svg`;
    } else {
      button.classList.remove("add-task-clicked");
      button.children[0].children[1].src = `./assets/icons/priority=${button.dataset.priority}.svg`;
    }
  }
}

/**
 * Put the value to the input title.
 * @param {string} title
 */
function editTaskTitle(title) {
  let editTaskEl = document.getElementById("add-task-title-input-edit");
  editTaskEl.value = title;
}

/**
 * Read the value from the input title and update the title of the task.
 * @returns {string} The new value read from the input title
 */
function saveEditTaskTitle() {
  const saveTaskElement = document.getElementById("add-task-title-input-edit");
  const newValue = saveTaskElement.value;
  newTask.title = newValue;
  return newValue;
}

/**
 * Put the value to the textarea description
 * @param {*} description
 */
function editTaskDescription(description) {
  const editDescriptionEl = document.getElementById("add-task-textarea-edit");
  editDescriptionEl.value = description;
}

/**
 * Read the value from the input title
 * @returns {string} The new value read from the input title
 */
function saveTaskDescription() {
  const saveDescriptionElement = document.getElementById("add-task-textarea-edit");
  const newValue = saveDescriptionElement.value;
  newTask.description = newValue;
  return newValue;
}

/**
 * Renders the assigned contacts in the edit task dialog.
 * This function clears the existing content in the container, then loops through
 * the contacts to be assigned, determines their background color, and generates
 * HTML elements for each contact to display them in the edit task dialog.
 */
function editTaskRenderAssignedTo() {
  const createContactsContainer = document.getElementById("add-task-contact-edit");
  createContactsContainer.innerHTML = "";

  for (let i = 0; i < contactsToAssigned.length; i++) {
    const contact = contactsToAssigned[i].name;
    const bgColor = assignColor(contact);
    const assigned = newTask.assignees.includes(contact);

    createContactsContainer.innerHTML += editTaskRenderAssignedToHtml(
      i,
      bgColor,
      contact,
      assigned
    );
  }
}

function editTaskAssignedTo() {
  const checkBoxes = document.querySelectorAll(".add-task-checkbox-edit");
  newTask.assignees = [];

  for (let i = 0; i < checkBoxes.length; i++) {
    const checkbox = checkBoxes[i];

    if (checkbox.checked) {
      newTask.assignees.push(checkbox.value);
    }
  }
  editTaskShowAvatars();
}

/**
 * Function to display avatars of assigned contacts for editing a task.
 */
function editTaskShowAvatars() {
  const avatarContainer = document.getElementById("add-task-assigned-avatar-edit");
  avatarContainer.innerHTML = "";
  let assignedContacts = newTask.assignees;

  for (let i = 0; i < assignedContacts.length; i++) {
    const contact = assignedContacts[i];
    const bgColor = assignColor(contact);
    avatarContainer.innerHTML += addTaskShowAvatarsHTML(bgColor, contact);
  }
}

/**
 * Displays avatars for assigned contacts in the edit task dialog.
 * @param {Array} assignees - An array containing assigned contacts for the task.
 */
function editTaskDialogAssignedToAvatars(assignees) {
  const avatarContainer = document.getElementById("add-task-assigned-avatar-edit");
  avatarContainer.innerHTML = "";

  for (let i = 0; i < assignees.length; i++) {
    const contact = assignees[i];
    const bgColor = assignColor(contact);
    avatarContainer.innerHTML += addTaskShowAvatarsHTML(bgColor, contact);
  }
}

/**
 * Updates the due date input field in the edit task dialog.
 * @param {*} date - The due date value to be set in the input field.
 */
function editTaskDialogDueDate(date) {
  const editDateEL = document.getElementById("date-edit");
  editDateEL.value = date;
}

/**
 * Updates the priority of the task in the edit task dialog.
 * @param {*} priority - The priority value to be set for the task.
 * @param {*} container - The container element for displaying priority options.
 * @param {*} event - The event object triggered by the user action.
 */
function editTaskDialogPriority(priority, container, event) {
  addTaskPrio(priority, container, event);
  newTask.priority = priority;
}

/**
 * Updates the category of the task in the edit task dialog.
 * @param {*} category - The category value to be set for the task.
 */
function editTaskChoseCategory(category) {
  document.getElementById("add-task-category-edit").value = category;
  newTask.category = category;
}

/**
 * Renders the list of subtasks in the edit task dialog.
 * @param {*} subtasksObject - An array containing the subtasks to be rendered.
 */
function editRenderTaskSubtasksList(subtasksObject) {
  const lists = document.getElementById("add-task-subtasks-list-edit");
  lists.innerHTML = "";

  for (let i = 0; i < subtasksObject.length; i++) {
    const subtasks = subtasksObject[i];
    const subtasksName = subtasks.name;
    lists.innerHTML += editRenderTaskSubtasksListHtml(i, subtasksName);
  }
}

/**
 * Adds a subtask to the task being edited in the edit task dialog.
 * @param {*} event - The event object triggered by the user action.
 * @returns void
 */
function editAddTaskSubtasks(event) {
  if (event.type === "keypress" && event.key !== "Enter") return;

  event.preventDefault();
  const subtasks = document.getElementById("add-task-subtasks-input-edit");
  const subtaskValue = subtasks.value.trim();

  if (!subtaskValue) return;

  newTask.subtasks.unshift({ name: subtaskValue, completed: false });
  editSubtasksList.unshift(subtaskValue);
  editAddTaskSubtasksList(); //Create the element from Subtasks input
  document.getElementById("add-task-subtasks-icon-plus-edit").classList.remove("d-none");
  document.getElementById("add-task-subtasks-icon-plus-check-edit").classList.add("d-none");
  subtasks.value = "";
}

/**
 *
 */
function editAddTaskSubtasksList() {
  const lists = document.getElementById("add-task-subtasks-list-edit");
  lists.innerHTML = "";

  for (let i = 0; i < editSubtasksList.length; i++) {
    const subtasks = editSubtasksList[i];
    lists.innerHTML += editAddTaskSubtasksListHtml(i, subtasks);
  }
}

/**
 * Handles the click event for adding a subtask in the edit task dialog.
 * @param {*} event - The event object triggered by the user action.
 */
function editSubtasksPlus(event) {
  event.preventDefault();
  editTaskSubtasksClicked();
  document.getElementById("add-task-subtasks-input-edit").focus();
  document.getElementById("add-task-subtasks-input-edit").select();
}

/**
 * Handles the click event for adding subtasks in the edit task dialog.
 * This function hides the "plus" icon and shows the "check" icon to indicate that subtasks are being added.
 */
function editTaskSubtasksClicked() {
  document.getElementById("add-task-subtasks-icon-plus-edit").classList.add("d-none");
  document.getElementById("add-task-subtasks-icon-plus-check-edit").classList.remove("d-none");
}

/**
 * Clears the subtasks input field and resets subtask icons in the edit task dialog.
 * @param {*} event - The event object triggered by the user action.
 */
function editClearSubtasks(event) {
  event.preventDefault();
  document.getElementById("add-task-subtasks-icon-plus-edit").classList.remove("d-none");
  document.getElementById("add-task-subtasks-icon-plus-check-edit").classList.add("d-none");
  document.getElementById("add-task-subtasks-input-edit").value = "";
}

/**
 * @param {*} i
 * @param {*} event
 */
function removeFromEditAddTaskSubtasksList(i, event) {
  event.stopPropagation();
  let removeSubtask = newTask.subtasks;
  editSubtasksList.splice(i, 1);
  removeSubtask.splice(i, 1);
  editAddTaskSubtasksList();
}

/**
 * Removes a subtask from the edit task subtasks list.
 * @param {*} i - The index of the subtask to be removed.
 * @param {*} event - The event object triggered by the user action.
 */
function editTaskSubtasksListInBoard(param, event) {
  event.stopPropagation();
  const ulElement = document.getElementById("add-task-subtasks-list-edit");
  ulElement.innerHTML = "";

  for (let i = 0; i < editSubtasksList.length; i++) {
    const lists = editSubtasksList[i];

    if (i === param) {
      let liElement = document.createElement("li");
      liElement.setAttribute("class", "add-task-subtask-li-edit");

      let inputElement = document.createElement("input");
      let inputDiv = document.createElement("div");
      inputDiv.setAttribute("class", "add-task-subtasks-input-edit-div");
      inputElement.setAttribute("class", "add-task-subtasks-input-edit");
      inputElement.setAttribute("id", "edit-task-subtasks-input-edit");
      inputElement.setAttribute("onkeypress", `confirmTaskSubtasksListInBoard(${i}, event)`);

      inputElement.setAttribute("type", "text");

      let iconsDiv = document.createElement("div");
      iconsDiv.className = "add-task-subtasks-icons-edit";

      let trashIcon = document.createElement("img");
      trashIcon.className = "add-task-trash";
      trashIcon.src = "./assets/icons/basket.svg";
      trashIcon.setAttribute("onclick", `removeFromEditAddTaskSubtasksList(${i}, event)`);

      let borderDiv = document.createElement("div");
      borderDiv.className = "add-tasks-border";

      let confirmIcon = document.createElement("img");
      confirmIcon.className = "add-task-confirm";
      confirmIcon.src = "./assets/icons/check-black.svg";
      confirmIcon.setAttribute("onclick", `confirmTaskSubtasksListInBoard(${i}, event)`);

      iconsDiv.appendChild(trashIcon);
      iconsDiv.appendChild(borderDiv);
      iconsDiv.appendChild(confirmIcon);

      inputDiv.appendChild(inputElement);
      inputDiv.appendChild(iconsDiv);
      liElement.appendChild(inputDiv);

      ulElement.appendChild(liElement);

      inputElement.value = lists;
    } else {
      let listItem = document.createElement("li");
      let spanElement = document.createElement("span");
      spanElement.className = "add-task-subtasks-extra-task";
      spanElement.id = "add-task-subtasks-extra-task";

      let textContent = document.createTextNode(lists);
      spanElement.appendChild(textContent);

      let iconsDiv = document.createElement("div");
      iconsDiv.className = "add-task-subtasks-icons";

      let trashIcon = document.createElement("img");
      trashIcon.className = "add-task-trash";
      trashIcon.src = "./assets/icons/basket.svg";
      trashIcon.setAttribute("onclick", `removeFromEditAddTaskSubtasksList(${i}, event)`);

      let borderDiv = document.createElement("div");
      borderDiv.className = "add-tasks-border";

      let editIcon = document.createElement("img");
      editIcon.className = "add-task-edit";
      editIcon.src = "./assets/icons/edit_dark.svg";
      editIcon.setAttribute("onclick", `editTaskSubtasksListInBoard(${i}, event)`);

      iconsDiv.appendChild(editIcon);
      iconsDiv.appendChild(borderDiv);
      iconsDiv.appendChild(trashIcon);

      listItem.appendChild(spanElement);
      listItem.appendChild(iconsDiv);

      let ulElement = document.getElementById("add-task-subtasks-list-edit");

      ulElement.appendChild(listItem);
    }
  }
}

function confirmTaskSubtasksListInBoard(i, event) {
  event.stopPropagation();
  if (event.type === "keypress" && event.key !== "Enter") return;

  const element = document.getElementById("edit-task-subtasks-input-edit").value;
  editSubtasksList.splice(i, 1, element);
  indexOfSubtasks = { name: element, completed: false };
  newTask.subtasks.splice(i, 1, indexOfSubtasks);

  editAddTaskSubtasksList();
}

/**
 * Saves the edited task and updates the board.
 */
async function saveEditTask() {
  document.getElementById("task-edit-dialog").classList.add("d-none");
  document.getElementById("task-show-dialog").classList.remove("d-none");
  renderDialog(currentIndex);
  saveEditTaskTitle();
  saveTaskDescription();

  boardTasks[currentIndex] = newTask;
  await saveTasks(boardTasks);
  renderBoard(boardTasks);
  initBoard();
}
