export default (() => {

    const TASK_LIST_KEY = "ToDooDoo";

    const taskFactory = (description="", toDoDate=new Date()) => {

        // Ensure time is not stored
        toDoDate.setHours(0, 0, 0, 0);

        return {
            description,
            toDoDate,
            done: false,
        }

    }

    // PRIVATE
    // Gets task list from database and returns it as an array
    function getTaskList() {
        const taskListJSON = localStorage.getItem(TASK_LIST_KEY);

        if (!taskListJSON) return null;

        const taskList = JSON.parse(taskListJSON);
        // JSON.parse doesn't parse the toDoDates properly so they should be manually converted to date objects
        taskList.forEach(task => task.toDoDate = new Date(task.toDoDate));

        return taskList;
    }

    // PRIVATE
    // takes an array and stores it in database
    function storeTaskList(taskList) {
        const taskListJSON = JSON.stringify(taskList);
        localStorage.setItem(TASK_LIST_KEY, taskListJSON);
    }

    function storeTask(task) {

        const taskList = getTaskList();
        taskList.push(task);
        storeTaskList(taskList);

    }

    function queryTasks(from, to=from) {

        // Ensure that you don't compare dates by time by setting all hours to zero
        from.setHours(0, 0, 0, 0);
        to.setHours(0, 0, 0, 0);

        const taskList = getTaskList();
        const queriedTasks = taskList.filter(task => task.toDoDate >= from || task.toDoDate <= to);

        return queriedTasks;

    }


    return {
        taskFactory, 
        storeTask,
        queryTasks,
    }

})();