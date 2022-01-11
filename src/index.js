import "./styles.css";

import { startOfWeek, endOfWeek } from 'date-fns';

import SplashScreen from "./modules/splashScreen";
import TaskUI from "./modules/taskUI";

// SplashScreen.load();

// Setup menu items
const todayPage = {
    title: "Today",
    dateRange: { from: new Date(), to: new Date() },
}
const todayBtn = document.getElementById("today-btn");
todayBtn.onclick = () => TaskUI.display(todayPage);

const weekPage = {
    title: "Week",
    dateRange: { from: startOfWeek(new Date()), to: endOfWeek(new Date()) },
}
const weekBtn = document.getElementById("week-btn");
weekBtn.onclick = () => TaskUI.display(weekPage);

const allPage = {
    title: "All Tasks",
    dateRange: undefined,
}
const allBtn = document.getElementById("all-btn");
allBtn.onclick = () => TaskUI.display(allPage);

// Setup project items
const newProjBtn = document.getElementById("new-project-btn");
newProjBtn.onclick = () => {
    const symbol = document.querySelector(".new-project-btn > span");
    const newProjPrompt = document.getElementById("new-project-form");

    if (newProjPrompt.classList.contains("active")) {
        symbol.classList.remove("rotate45");
        newProjPrompt.classList.remove("active");
    } else {
        symbol.classList.add("rotate45");
        newProjPrompt.classList.add("active");
    }

};


// Start by showing today's tasks
TaskUI.display(todayPage);

