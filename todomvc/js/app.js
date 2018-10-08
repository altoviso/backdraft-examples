import {render} from "./backdraft.js";
import ToDo from "./ToDo.js";
import model from "./model.js";

let todo = render(ToDo, {model: model}, "todoapp");

function route(){
	todo.setFilter(location.hash.substring(2));
}
route();
window.addEventListener("hashchange", route);

