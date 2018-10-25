import {Component, e} from "../backdraft.js";
import Button from "./Button.js";

export default class RadioGroup extends Component.withWatchables("value") {
	constructor(kwargs){
		super(kwargs);
		this.kwargs.group.forEach(item => "value" in item || (item.value = item.label));
	}

	onMutateValue(value){
		this.children && this.children.forEach(child => {
			value === child.kwargs.value ?
				child.addClassName("checked") :
				child.removeClassName("checked");
		});
	}

	bdElements(){
		return e("div", this.kwargs.group.map(item =>
			e(Button, {
				label: item.label,
				value: item.value,
				className: this.value === item.value ? "checked" : "",
				handler: () => (this.value = item.value)
			})
		));
	}
}
RadioGroup.className = "bd-radio-group";
