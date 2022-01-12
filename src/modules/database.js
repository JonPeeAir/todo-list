const DATABASE_KEY = "ToDooDoo";

export default (() => {

    function getDatabase() {
        const databaseJSON = localStorage.getItem(DATABASE_KEY);
        if (!databaseJSON) return {};

        const database = JSON.parse(databaseJSON);
        return database;
    }

    function storeDatabase(database) {
        // Create new event to alert page whenever we update the local storage
        const event = new Event("storageUpdate");

        const databaseJSON = JSON.stringify(database);
        localStorage.setItem(DATABASE_KEY, databaseJSON);

        document.dispatchEvent(event);
    }

    return { getDatabase, storeDatabase };

})();