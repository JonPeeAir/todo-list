import { format, lightFormat } from "date-fns";

import TaskUtils from "./taskUtils"

export default (() => {

    function display(pageInfo) {
        // reload tasks when a change is made to local storage
        document.addEventListener("storageUpdate", () => loadTasks(pageInfo.dateRange));

        setupTitle(pageInfo.title, pageInfo.dateRange);
        setupNewTaskBtn(pageInfo.dateRange);
        loadTasks(pageInfo.dateRange);
        
    }

    function setupTitle(pageTitle, dateRange) {
        const title = document.getElementById("title");
        title.textContent = pageTitle;

        const dateElement = document.getElementById("date");

        if (dateRange === undefined) {
            dateElement.textContent = "";
        } else if (dateRange.from.getTime() === dateRange.to.getTime()) {
            dateElement.textContent = format(dateRange.from, "MMMM d, y");
        } else {
            dateElement.textContent = format(dateRange.from, "MMMM d") + " - " + format(dateRange.to, "d, y");
        }

    }

    function setupNewTaskBtn(dateRange) {
        setupNewTaskForm(dateRange);

        const newTaskBtn = document.getElementById("new-task-btn");
        newTaskBtn.onclick = showNewTaskForm;
    }

    function setupNewTaskForm(dateRange) {
        const form = document.getElementById("modal-form");
        form.onsubmit = addNewTask;
        form.onreset = removeNewTaskPrompt;

        const dateInput = document.getElementById("date-value");
        if (dateRange === undefined) {
            dateInput.removeAttribute("min");
            dateInput.removeAttribute("max");
        } else {
            dateInput.setAttribute("min", lightFormat(dateRange.from, "yyyy-MM-dd"));
            dateInput.setAttribute("max", lightFormat(dateRange.to, "yyyy-MM-dd"));
        }

    }

    function showNewTaskForm() {
        const modalBackground = document.getElementById("modal-bg")
        const newTaskModal= document.getElementById("new-task-modal");

        newTaskModal.classList.add("active");
        modalBackground.classList.add("active");
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
        const form = document.getElementById("modal-form");

        const newTask = TaskUtils.newTask(taskInput.value, dateInput.valueAsDate);
        TaskUtils.addNewTask(newTask);

        form.reset();
        removeNewTaskPrompt();

        return false;
    }

    function loadTasks(dateRange) {
        const taskList = dateRange === undefined ? TaskUtils.getTaskList() : TaskUtils.getTasks(dateRange.from, dateRange.to);
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
        noTaskText.id = "empty-task-text";
        noTaskText.textContent = "Hmm.. looks like there's nothing to do today";

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

    return { display }

})();