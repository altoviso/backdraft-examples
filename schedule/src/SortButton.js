import {Component, e} from "./backdraft.js"

let stateToUiClass = ["icon-sort-none", "icon-sort-asc", "icon-sort-desc"];

export default class SortButton extends Component {
	constructor(kwargs){
		super(kwargs);
		this._state = 0;
		this.className = stateToUiClass[0];
		this.state = "state" in kwargs ? kwargs.state : 0;
	}

	get state(){
		return this._state;
	}

	set state(value){
		value = value % 3;
		if(this._state !== value){
			this.className = stateToUiClass[value];
			this._applyWatchers("state", "_state", value);
		}
	}

	_elements(){
		return e("div", {
				[e.staticClassName]: "bdt-state-button",
				[e.advise]: {
					click: () =>{
						this._applyHandlers("click")
					}
				}
			}, e("div", this.kwargs.label)
		);
	}
}
