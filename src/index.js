import "./styles.css";

import SplashScreen from "./splashScreen";
import Today from "./tabs/today";
import Week from "./tabs/week";
import AllTasks from "./tabs/allTasks";

SplashScreen.load();

// Setup menu items
const todayBtn = document.getElementById("today-btn");
todayBtn.onclick = Today.display;

const weekBtn = document.getElementById("week-btn");
weekBtn.onclick = Week.display;

const allBtn = document.getElementById("all-btn");
allBtn.onclick = AllTasks.display;

// Start by showing today's tasks
Today.display();
