import {Component, e, stopEvent} from "../backdraft.js";

export default class Button extends Component {
	bdElements(){
		return e("div", {bdOn_click: this._onClick.bind(this)},
			e("div", this.kwargs.label)
		);
	}

	_onClick(e){
		stopEvent(e);
		this.kwargs.handler && this.kwargs.handler();
	}
}
Button.className = "bd-button";
