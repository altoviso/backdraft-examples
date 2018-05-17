import Button from "./Button.js"

export default class TwoStateButton extends Button {
	constructor(kwargs){
		super(kwargs);
		this.value = "value" in kwargs ? kwargs.value : false;
	}

	get value(){
		return this._value;
	}

	set value(newValue){
		if(this._applyWatchers("value", "_value", !!newValue) && this.rendered){
			this[this.value ? "addClassName" : "removeClassName"]("checked");
		}
	}

	postRender(){
		if(this.value){
			this.addClassName("checked");
		}
	}

	_onClick(e){
		this.value = !this.value;
		super._onClick(e);
	}
}
TwoStateButton.className = "bd-two-state-button";
