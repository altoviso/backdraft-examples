import Schedule from "./Schedule.js"
import {data} from "../data/scheduleData.js"

Schedule.render(Schedule, {data:data}, document.getElementById("root"));
