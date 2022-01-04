export default (() => {

    function clearTaskDisplay() {
        const taskDisplay = document.getElementById("task-list");

        taskDisplay.style.display = "block";
        taskDisplay.innerHTML = "";
    }

    function displayEmptyTaskScreen() {
        const taskDisplay= document.getElementById("task-list");
        taskDisplay.style.display = "flex";

        const noTaskText = document.createElement("p");
        noTaskText.id = "empty-task-text";
        noTaskText.textContent = "Hmm.. looks like there's nothing to do today";

        taskDisplay.append(noTaskText);
    }

    function displayTasksFromList(taskList) {
        clearTaskDisplay();
        if (!taskList || taskList.length === 0) {
            displayEmptyTaskScreen();
        } else {
            const taskDisplay = document.getElementById("task-list");
            taskList.forEach(task => taskDisplay.appendChild(task.toHtmlElement()));
        }
    }

    return {
        displayTasksFromList,
    }

})();