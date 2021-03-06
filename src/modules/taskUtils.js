import { format, formatDistance, formatDistanceToNow, formatDistanceToNowStrict, formatRelative, isPast, isToday } from "date-fns";
import Database from "./database";
import taskUI from "./taskUI";

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

export default (() => {

    const taskPrototype = {
        toHtmlElement() {
            const taskItem = document.createElement("li");
            taskItem.dataset.id = this.id;
            taskItem.onclick = () => taskUI.showTaskModal("edit", this);
            
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = this.id;
            checkbox.id = this.id;
            checkbox.checked = this.done;
            checkbox.onclick = e => {
                e.stopPropagation();
                changeTaskStatus(this.id);
            };

            const label = document.createElement("label");
            label.htmlFor = this.id;
            label.textContent = this.description;
            label.onclick = e => e.stopPropagation();

            const date = document.createElement("p");
            date.textContent = format(this.toDoDate, "E MMM. d") ;
            if (isToday(this.toDoDate)) {
                date.textContent = "Today"
                date.classList.add("green-text");
            } else if (isPast(this.toDoDate)) {
                date.classList.add("red-text");
            } else {
                date.textContent = formatDistanceToNow(this.toDoDate, {addSuffix: true}) ;
            }

            const deleteBtn = document.createElement("button");
            deleteBtn.dataset.id = this.id;
            deleteBtn.onclick = e => {
                e.stopPropagation();
                removeTask(this.id);
            };

            taskItem.append(checkbox, label, date, deleteBtn);
            return taskItem;
        },
        
    }

    const newTask = (description="", toDoDate=new Date(), projectID="") => {

        // Ensure time is not stored
        toDoDate.setHours(0, 0, 0, 0);

        // Create a task object and attach the task prototype 
        const task = Object.create(taskPrototype);

        // Set the values in the task object
        task.description = description;
        task.toDoDate = toDoDate;
        task.projectID = projectID;
        task.id = (description + toDoDate.toISOString()).hashCode();
        task.done = false;

        return task;
    }

    // Gets task list from database and returns it as an array
    function getTaskList() {
        const taskList = Database.getDatabase().taskList;
        if (!taskList) return null;

        // JSON.parse doesn't parse the task objects properly so we manually parse some aspects of task ourselves
        taskList.forEach(task => {
            task.toDoDate = new Date(task.toDoDate);
            Object.setPrototypeOf(task, taskPrototype);
        });

        return taskList;
    }

    // takes an array and stores it in database
    function storeTaskList(taskList) {
        const database = Database.getDatabase();
        database.taskList = taskList;
        Database.storeDatabase(database);
    }

    function addNewTask(task) {
        let taskList = !getTaskList() ? [] : getTaskList();
        taskList.push(task);
        storeTaskList(taskList);
    }

    function getTask(taskID) {
        const taskList = getTaskList();
        if (!taskList) return;

        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].id == taskID) {
                return taskList[i];
            }
        }

        return null;
    }

    function updateTask(taskID, newTask) {
        const taskList = getTaskList();
        if (!taskList) return;

        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].id == taskID) {
                taskList[i] = newTask;
            }
        }

        storeTaskList(taskList);

    }

    function removeTask(taskID) {
        const taskList = getTaskList();
        if (!taskList) return;

        const updatedTaskList = taskList.filter(task => task.id != taskID);
        storeTaskList(updatedTaskList);
    }

    function changeTaskStatus(taskID) {
        const taskList = getTaskList();
        if (!taskList) return;

        taskList.forEach(task => { if (task.id == taskID) task.done = !task.done; });
        storeTaskList(taskList);
    }


    function getTasksByTime(from, to=from) {

        // Ensure that you don't compare dates by time by setting all hours to zero
        from.setHours(0, 0, 0, 0);
        to.setHours(0, 0, 0, 0);

        const taskList = getTaskList();
        if (!taskList) return null;

        const queriedTasks = taskList.filter(task => task.toDoDate >= from && task.toDoDate <= to);
        return queriedTasks;
    }

    function getTasksByProject(projectID) {
        const taskList = getTaskList();
        if (!taskList) return null;

        const queriedTasks = taskList.filter(task => task.projectID == projectID);
        return queriedTasks;
    }


    return {
        storeTaskList,
        newTask, 
        addNewTask,
        getTask,
        updateTask,
        getTasksByTime,
        getTasksByProject,
        getTaskList
    }

})();