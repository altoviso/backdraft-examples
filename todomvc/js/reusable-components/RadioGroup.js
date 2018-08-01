import {Component, e, stopEvent} from "../backdraft.js"
import Button from "./Button.js"

export default class RadioGroup extends Component {
	constructor(kwargs){
		super(kwargs);
		this.kwargs.group.forEach((item)=>(!("value" in item) && (item.value = item.label)));
		this.value = kwargs.value;
	}

	_elements(){
		return e("div", this.kwargs.group.map((item, i) =>
			e(Button, Object.assign({}, item, {handler: () => (this.value = item.value)}))
		));
	}

	postRender(){
		this._checkSelectedItem(this._selected);
	}

	get value(){
		return this._selected >= 0 ? this.kwargs.group[this._selected].value : this.kwargs.default;
	}

	set value(value){
		let mutate = (oldValue, newValue, i) =>{
			this._selected = i;
			this._applyWatchersRaw("value", oldValue, value);
			this.rendered && this._checkSelectedItem(i);
		};

		this.kwargs.group.some((item, i) =>{
			if(item.value === value){
				mutate(this.value, value, i);
				return true;
			}
		}) || mutate(this.value, undefined, -1);
	}

	_checkSelectedItem(index){
		this.children.forEach(child => child.removeClassName("checked"));
		index >= 0 && this.children[index].addClassName("checked");
	}

}
RadioGroup.className = "bd-radio-group";
