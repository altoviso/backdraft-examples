import {render} from "./backdraft.js"
import Schedule from "./Schedule.js"
import {data} from "../data/scheduleData.js"

render(Schedule, {data: data}, document.getElementById("root"));
