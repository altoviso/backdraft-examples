import {render} from "./backdraft.js"
import Schedule from "./Schedule.js"
import {data} from "../data/scheduleData.js"

let bigData = [];
for(let i = 0, count = 0; i<100; i++) bigData = bigData.concat(data.map(item=>Object.assign({}, item, {id:count++})));

render(Schedule, {data: data}, document.getElementById("root"));
