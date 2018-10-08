import Button from "./Button.js";
import {withWatchables, e} from "../backdraft.js";

export default class TwoStateButton extends withWatchables(Button, "value") {
	bdElements(){
		return e(
			"div", {
				bdReflectClass: ["value", value => value ? "checked" : ""],
				bdOn_click: this._onClick.bind(this)
			},
			e("div", this.kwargs.label)
		);
	}

	_onClick(e){
		this.value = !this.value;
		super._onClick(e);
	}
}
TwoStateButton.className = "bd-two-state-button";
