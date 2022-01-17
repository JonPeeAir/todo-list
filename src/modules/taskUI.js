import { format, lightFormat } from "date-fns";

import TaskUtils from "./taskUtils"

export default (() => {

    function display(pageInfo) {

        if (pageInfo.type === "general") {
            // reload tasks when a change is made to local storage
            document.addEventListener("storageUpdate", () => loadTasksByTime(pageInfo.dateRange));

            setupTitle(pageInfo.title, pageInfo.dateRange);
            loadTasksByTime(pageInfo.dateRange);
        } else if (pageInfo.type === "project") {
            // reload tasks when a change is made to local storage
            document.addEventListener("storageUpdate", () => loadTasksByProject(pageInfo.projectID));

            setupTitle(pageInfo.title, undefined, pageInfo.projectID);
            loadTasksByProject(pageInfo.projectID);
        }
        setupNewTaskBtn();
    }

    function setupTitle(pageTitle, dateRange=undefined, projectID=undefined) {
        const title = document.getElementById("title");
        title.textContent = pageTitle;
        title.dataset.id = projectID;

        const dateElement = document.getElementById("date");

        if (dateRange === undefined) {
            dateElement.textContent = "";
        } else if (dateRange.from.getTime() === dateRange.to.getTime()) {
            dateElement.textContent = format(dateRange.from, "MMMM d, y");
        } else {
            dateElement.textContent = format(dateRange.from, "MMMM d") + " - " + format(dateRange.to, "d, y");
        }

    }

    function setupNewTaskBtn() {
        const newTaskBtn = document.getElementById("new-task-btn");
        newTaskBtn.onclick = () => showTaskModal("create");
    }

    function showTaskModal(mode, task=null) {
        if (mode === "create") {
            setupTaskModal("create");
        } else if (mode === "edit") {
            setupTaskModal("edit", task);
        }

        const modalBackground = document.getElementById("modal-bg")
        const newTaskModal= document.getElementById("new-task-modal");

        newTaskModal.classList.add("active");
        modalBackground.classList.add("active");
    }

    function setupTaskModal(mode, task=null) {
        const modalTitle = document.getElementById("modal-title");
        const taskInput = document.getElementById("task-value");
        const dateInput = document.getElementById("date-value");
        const projInput = document.getElementById("proj-value");
        const submitBtn = document.getElementById("submit-btn");
        const form = document.getElementById("modal-form");
        form.onreset = removeNewTaskPrompt;

        if (mode === "create") {

            modalTitle.innerHTML = "Create new task <hr>";
            taskInput.value = "";
            dateInput.value = "";
            // This selects the default project choice
            Array.from(projInput.options).filter(project => project.value == "")[0].selected = true;

            submitBtn.textContent = "Add";
            form.onsubmit = addNewTask;

        } else if (mode === "edit") {

            modalTitle.innerHTML = "Edit task <hr>";
            taskInput.value = task.description;
            dateInput.value = lightFormat(task.toDoDate, "yyyy-MM-dd");
            // this selects the project that the task is assigned to
            Array.from(projInput.options).filter(project => project.value == task.projectID)[0].selected = true;

            submitBtn.textContent = "Save";
            form.onsubmit = () => updateTask(task.id);

        }

    }

    function removeNewTaskPrompt() {
        const modalBackground = document.getElementById("modal-bg")
        const newTaskModal= document.getElementById("new-task-modal");

        modalBackground.classList.remove("active");
        newTaskModal.classList.remove("active");
    }

    function addNewTask() {
        const taskInput = document.getElementById("task-value");
        const dateInput = document.getElementById("date-value");
        const projInput = document.getElementById("proj-value");

        const newTask = TaskUtils.newTask(taskInput.value, dateInput.valueAsDate, projInput.value);
        TaskUtils.addNewTask(newTask);

        const form = document.getElementById("modal-form");
        form.reset();
        removeNewTaskPrompt();

        return false;
    }

    function updateTask(taskID) {
        const taskInput = document.getElementById("task-value");
        const dateInput = document.getElementById("date-value");
        const projInput = document.getElementById("proj-value");

        const updatedTask = TaskUtils.newTask(taskInput.value, dateInput.valueAsDate, projInput.value);
        updatedTask.done = TaskUtils.getTask(taskID).done;

        TaskUtils.updateTask(taskID, updatedTask);

        const form = document.getElementById("modal-form");
        form.reset();
        removeNewTaskPrompt();

        return false;
    }

    function loadTasksByTime(dateRange) {
        const taskList = dateRange === undefined ? TaskUtils.getTaskList() : TaskUtils.getTasksByTime(dateRange.from, dateRange.to);
        showTasksFromList(taskList);
    }
    
    function loadTasksByProject(projectID) {
        if (!projectID) {
            console.error("project id is invalid");
            return;
        }

        const taskList = TaskUtils.getTasksByProject(projectID);
        showTasksFromList(taskList);
    }

    function clearTaskScreen() {
        const taskScreen = document.getElementById("task-list");
        taskScreen.style.display = "block";
        taskScreen.innerHTML = "";
    }

    function showEmptyTaskScreen() {
        const taskScreen= document.getElementById("task-list");
        taskScreen.style.display = "flex";

        const noTaskText = document.createElement("p");
        noTaskText.classList.add("empty-text");
        noTaskText.textContent = `Hmm.. looks like there's nothing to do today...`;

        taskScreen.append(noTaskText);
    }

    function showTasksFromList(taskList) {
        clearTaskScreen();
        if (!taskList || taskList.length === 0) {
            showEmptyTaskScreen();
        } else {
            const taskDisplay = document.getElementById("task-list");
            taskList.forEach(task => {
                const taskElement = task.toHtmlElement();
                if (task.done) {
                    taskElement.style.textDecoration = "line-through";
                }

                taskDisplay.appendChild(taskElement);

            });
        }
    }

    return { display, showTaskModal }

})();