import { format } from "date-fns";
import TaskUtils from "./taskUtils";

export default (() => {

    function display() {
        setupTitle();
        loadTasks();

        // Code below is just to test the taskUtils
        const task = TaskUtils.taskFactory("take out trash");
        TaskUtils.storeTask(task);

        console.log(TaskUtils.queryTasks(new Date()));

    }

    function setupTitle() {
        const title = document.getElementById("title");
        title.textContent = "Today";

        const dateElement = document.getElementById("date");
        dateElement.textContent = format(new Date(), "MMMM d, y");
    }

    function setupNewTaskBtn() {

    }

    function loadTasks() {
        const allTasks = localStorage.getItem("JNPR-todo");

        if (!allTasks) {
            displayEmptyTaskScreen();
        } else {
            const taskList = document.getElementById("task-list");
            taskList.style.display = "block";
        }
    }

    function displayEmptyTaskScreen() {
        const taskList = document.getElementById("task-list");
        taskList.style.display = "flex";
        taskList.style.justifyContent = "center";
        taskList.style.alignItems = "center";

        const noTaskText = document.createElement("p");
        noTaskText.id = "empty-task-text";
        noTaskText.textContent = "Hmm.. looks like there's nothing to do today";

        taskList.append(noTaskText);
    }


    return {
        display
    }

})();