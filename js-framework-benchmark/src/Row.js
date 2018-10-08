import {Component, e} from "./backdraft.js";

export default class Row extends Component.withWatchables("label") {
	constructor(kwargs){
		super(kwargs);
		kwargs.selected && (this.selected = true);
	}

	get selected(){
		return !!this._selected;
	}

	set selected(value){
		value = !!value;
		if(this._selected !== value){
			if(value){
				this.addClassName("danger");
				this._selected = true;
			}else{
				this.removeClassName("danger");
				delete this._selected;
			}
			this.bdMutate("selected", !value, value);
		}
	}

	bdElements(){
		return e("tr",
			e("td", {className: "col-md-1"}, this.kwargs.id),
			e("td", {className: "col-md-4"},
				e("a", {
					bdReflect: "label",
					bdOn_click: () => this.bdNotify({type: "select", id: this.kwargs.id})
				})
			),
			e("td", {className: "col-md-1"},
				e("a", {
					bdOn_click:() => this.bdNotify.bind(this, {name: "delete", id: this.id}),
					innerHTML: "<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span>"
				})
			),
			e("td", {className: "col-md-6"})
		);
	}
}

