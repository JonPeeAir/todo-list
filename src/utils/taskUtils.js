export default (() => {

    const TASK_LIST_KEY = "ToDooDoo";

    // Got this from stackoverflow
    // This will be used for creating task ids
    String.prototype.hashCode = function() {
        let hash = 0, i, chr;
        if (this.length === 0) return hash;
        for (i = 0; i < this.length; i++) {
            chr   = this.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };


    const taskPrototype = {
        toHtmlElement() {
            const taskItem = document.createElement("li");

            const taskCheckbox = document.createElement("input");
            taskCheckbox.type = "checkbox";
            taskCheckbox.name = this.id;
            taskCheckbox.id = this.id;

            const taskLabel = document.createElement("label");
            taskLabel.htmlFor = taskCheckbox.id;
            taskLabel.textContent = this.description;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "delete";
            deleteBtn.dataset.id = this.id;
            deleteBtn.onclick = removeThisTask;

            function removeThisTask() {
                removeTask(this.dataset.id);
            }

            taskItem.append(taskCheckbox, taskLabel, deleteBtn);
            return taskItem;
        }
    }

    const newTask = (description="", toDoDate=new Date()) => {

        // Ensure time is not stored
        toDoDate.setHours(0, 0, 0, 0);

        // Create a task object and attach the task prototype 
        const task = Object.create(taskPrototype);

        // Set the values in the task object
        task.description = description;
        task.toDoDate = toDoDate;
        task.id = (description + toDoDate.toISOString()).hashCode();
        task.done = false;

        return task;
    }

    // Gets task list from database and returns it as an array
    function getTaskList() {
        const taskListJSON = localStorage.getItem(TASK_LIST_KEY);

        if (!taskListJSON) return null;

        const taskList = JSON.parse(taskListJSON);
        // JSON.parse doesn't parse the task objects properly so we manually parse some aspects of task ourselves
        taskList.forEach(task => {
            task.toDoDate = new Date(task.toDoDate);
            Object.setPrototypeOf(task, taskPrototype);
        });

        return taskList;
    }

    // takes an array and stores it in database
    function storeTaskList(taskList) {

        // Create new event to alert page whenever we update the local storage
        const event = new Event("storageUpdate");

        const taskListJSON = JSON.stringify(taskList);
        localStorage.setItem(TASK_LIST_KEY, taskListJSON);
        document.dispatchEvent(event);

    }

    function addNewTask(task) {
        let taskList = !getTaskList() ? [] : getTaskList();
        taskList.push(task);
        storeTaskList(taskList);
    }

    function removeTask(taskID) {
        const taskList = getTaskList();
        if (!taskList) return;

        const updatedTaskList = taskList.filter(task => task.id != taskID);
        storeTaskList(updatedTaskList);
    }


    function getTasks(from, to=from) {

        // Ensure that you don't compare dates by time by setting all hours to zero
        from.setHours(0, 0, 0, 0);
        to.setHours(0, 0, 0, 0);

        const taskList = getTaskList();
        if (!taskList) return null;

        const queriedTasks = taskList.filter(task => task.toDoDate >= from && task.toDoDate <= to);
        return queriedTasks;
    }


    return {
        newTask, 
        addNewTask,
        getTasks,
    }

})();