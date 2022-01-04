import "./styles.css";

import SplashScreen from "./splashScreen";
import Today from "./today";
import Week from "./week";
import AllTasks from "./allTasks";

// SplashScreen.load();

// Setup menu items
const todayBtn = document.getElementById("today-btn");
todayBtn.onclick = Today.display;

const weekBtn = document.getElementById("week-btn");
weekBtn.onclick = Week.display;

const allBtn = document.getElementById("all-btn");
allBtn.onclick = AllTasks.display;

// Start by showing today's tasks
Today.display();
