import { format } from "date-fns";
import TaskUtils from "../utils/taskUtils";
import TaskUI from "../utils/taskUI";

export default (() => {

    function display() {
        // Set a listener to reload tasks whenever storage has been updated
        document.addEventListener("storageUpdate", loadTasks);

        setupTitle();
        setupNewTaskBtn();
        loadTasks();
    }

    function setupTitle() {
        const title = document.getElementById("title");
        title.textContent = "Today";

        const dateElement = document.getElementById("date");
        dateElement.textContent = format(new Date(), "MMMM d, y");
    }

    function setupNewTaskBtn() {
        const newTaskBtn = document.getElementById("new-task-btn");
        newTaskBtn.onclick = showAndSetupNewTaskPrompt;

        function showAndSetupNewTaskPrompt() {
            const modalBackground = document.getElementById("modal-bg");
            modalBackground.classList.add("active");

            const newTaskModal= document.getElementById("new-task-modal");
            newTaskModal.classList.add("active");

            const form = document.getElementById("modal-form");
            form.onsubmit = addNewTask;
            form.onreset = removeNewTaskPrompt;


            function removeNewTaskPrompt() {
                const taskInput = document.getElementById("task-value");
                taskInput.value = "";

                modalBackground.classList.remove("active");
                newTaskModal.classList.remove("active");
            }

            function addNewTask() {
                const taskInput = document.getElementById("task-value");
                const dateInput = document.getElementById("date-value");

                const newTask = TaskUtils.newTask(taskInput.value, dateInput.valueAsDate);
                TaskUtils.addNewTask(newTask);

                form.reset();

                removeNewTaskPrompt();

                return false;
            }

        }
    }

    function loadTasks() {
        const today = new Date();
        const tasksToday = TaskUtils.getTasks(today);
        console.log(tasksToday);
        TaskUI.showTasksFromList(tasksToday);
    }

    return {
        display
    }

})();