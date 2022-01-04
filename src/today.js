import { format } from "date-fns";
import TaskUtils from "./taskUtils";
import TaskUI from "./taskUI";

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
        newTaskBtn.onclick = createDummyTask;

        function createDummyTask() {
            TaskUtils.addNewTask(TaskUtils.newTask(new Date().toString()));
        }
    }

    function loadTasks() {
        const today = new Date();
        const tasksToday = TaskUtils.getTasks(today);
        TaskUI.displayTasksFromList(tasksToday);
    }

    return {
        display
    }

})();