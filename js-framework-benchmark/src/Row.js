import {Component, e} from "./backdraft.js"

export default class Row extends Component {
	constructor(kwargs){
		super(kwargs);
		this._label = kwargs.label;
		kwargs.selected && (this._selected = true);
		this.watch("label", (newValue) => this._labelNode && (this._labelNode = newValue));
	}

	get label(){
		return this._label;
	}

	set label(label){
		this._applyWatchers("label", "_label", label);
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
			this._applyWatchers("selected", !value, value)
		}
	}

	get elements(){
		return e("tr",
			e("td", {className: "col-md-1"}, this.kwargs.id),
			e("td", {className: "col-md-4"},
				e("a", {
						[e.attach]: "_labelNode",
						[e.advise]: {
							click: this._applyHandlers.bind(this, {name: "select", id: this.kwargs.id})
						}
					}, this._label
				)
			),
			e("td", {className: "col-md-1"},
				e("a", {
					[e.advise]: {
						click: this._applyHandlers.bind(this, {name: "delete", id: this.id})
					},
					innerHTML: '<span className="glyphicon glyphicon-remove" aria-hidden="true"></span>'
				})
			),
			e("td", {className: "col-md-6"})
		);
	}
}

