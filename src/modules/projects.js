import Database from "./database";

// Got this from stackoverflow
// This will be used for creating project ids
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

    const projectProto = {
        toHtmlElement() {
            const projItem = document.createElement("li");
            projItem.innerHTML = `<button class="menu-secondaryStyle">${this.name}</button>`;

            const projDelBtn = document.createElement("button");
            console.log(this);
            projDelBtn.dataset.id = this.id;
            projDelBtn.classList.add("del-proj-btn");
            projDelBtn.innerHTML = "&times;";
            projDelBtn.onclick = this.delete;
            projItem.appendChild(projDelBtn);

            return projItem;
        },

        delete() {
            const projectList = Database.getDatabase().projectList;
            if (!projectList.length) return;

            const updatedProjList = projectList.filter(project => project.id != this.dataset.id);
            storeProjectList(updatedProjList);
        }
    }

    const newProject = (projName) => {
        const project = Object.create(projectProto);
        project.name = projName;
        project.id = projName.hashCode();

        return project
    }

    function loadProjects() {
        const projectList = getProjectList();
        clearProjectScreen();

        if (!projectList.length) {
            showEmptyProjectScreen();
        } else {
            const projectsDisplay = document.getElementById("projects");
            projectList.forEach(project => projectsDisplay.append(project.toHtmlElement()));
        }
    }

    function clearProjectScreen() {
        const projectsDisplay = document.getElementById("projects");
        projectsDisplay.innerHTML = "";
    }

    function showEmptyProjectScreen() {
        const projectsDisplay = document.getElementById("projects");
        projectsDisplay.innerHTML = `<p class="empty-text">Add a Project by clicking the button below</p>`;
    }

    function getProjectList() {
        const projectList = Database.getDatabase().projectList;
        if (!projectList) return [];

        projectList.forEach(project => Object.setPrototypeOf(project, projectProto));

        return projectList;
    }

    function storeProjectList(projectList) {
        const updatedDatabase = Database.getDatabase();
        updatedDatabase.projectList = projectList;
        Database.storeDatabase(updatedDatabase);
    }

    function addNewProject() {
        const newProjInput = document.getElementById("proj-title");
        const project = newProject(newProjInput.value);

        if (projectListContains(project.id)) {
            alert("Project already exists!");
            return false;
        }

        const projectList = getProjectList();
        projectList.push(project);
        storeProjectList(projectList);

        closeNewProjPrompt();

        return false;
    }

    function projectListContains(projectID) {
        const projectList = getProjectList();
        if (!projectList.length) return false;

        for (let i = 0; i < projectList.length; i++) {
            if (projectList[i].id == projectID) return true;
        }

        return false;
    }

    function setupNewProjPrompt() {
        const projForm = document.getElementById("new-project-form");
        projForm.onsubmit = addNewProject;
    }

    function openNewProjPrompt() {
        const symbol = document.querySelector(".new-project-btn > span");
        const newProjPrompt = document.getElementById("new-project-form");
        const newProjInput = document.getElementById("proj-title");

        symbol.classList.add("rotate45");
        newProjPrompt.classList.add("active");
        setTimeout(() => newProjInput.focus(), 100);
    }

    function closeNewProjPrompt() {
        const symbol = document.querySelector(".new-project-btn > span");
        const newProjPrompt = document.getElementById("new-project-form");
        const projForm = document.getElementById("new-project-form");

        symbol.classList.remove("rotate45");
        newProjPrompt.classList.remove("active");
        projForm.reset();
    }

    function setupNewProjButton() {
        const newProjBtn = document.getElementById("new-project-btn");
        newProjBtn.onclick = () => {
            const newProjPrompt = document.getElementById("new-project-form");

            if (newProjPrompt.classList.contains("active")) {
                closeNewProjPrompt();
            } else {
                openNewProjPrompt();
            }
        };

    }

    return {
        loadProjects, 
        setupNewProjPrompt, 
        setupNewProjButton,
    }

})();