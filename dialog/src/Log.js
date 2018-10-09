import {Component, e, watch} from "./backdraft.js";

export default class Log extends Component {
	constructor(kwargs){
		super(kwargs);
		watch(kwargs.files, (newValue, oldValue, data, prop) => {
			this.log.innerHTML += `file[${prop[0]}] name updated to ${this.kwargs.files[prop[0]].name}<br>`;
		});
	}

	bdElements(){
		return e("div",
			e("h3", "Log of Name Changes"),
			e("div", {className: "log", bdAttach: "log"})
		);
	}
}
