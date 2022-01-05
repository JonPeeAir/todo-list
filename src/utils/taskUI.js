export default (() => {

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
            taskList.forEach(task => taskDisplay.appendChild(task.toHtmlElement()));
        }
    }

    return {
        showTasksFromList,
    }

})();