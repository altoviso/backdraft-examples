import {Component, e, connect, stopEvent} from "./backdraft.js"

export default class StateButton extends Component {
	constructor(kwargs){
		super(kwargs);
		this._label = "label" in kwargs ? kwargs.label : "Button";
		this._states = kwargs.states || ["on", "off"];
		this.value = "value" in kwargs ? kwargs.value : this._states[0];
	}

	get label(){
		return this._label;
	}

	set label(value){
		if(this._applyWatchers("label", "_label", value) && this.rendered){
			//this._labelNode = value;
		}
	}

	get value(){
		return this._value;
	}

	set value(newValue){
		if(newValue !== this._value){
			let index = this._states.indexOf(newValue);
			if(index !== -1){
				let oldValue = this._value;
				this._value = newValue;
				this.className = newValue + "";
				this._applyWatchersRaw("value", oldValue, this._value)
			}else{
				console.error("illegal value");
			}
		}// else, no change, ignore
	}

	_elements(){
		return e("div",
			{
				className: "bd-state-button",
				[e.advise]: {"click": this._onClick.bind(this)}
			},
			e("div", {[e.attach]: "_labelNode"}, this._label)
		)
	}

	postRender(){
		return this.watch({
			label: (newValue) => (this._labelNode.innerHTML = newValue),
			hasFocus: this._focusWatcher.bind(this),
		});
	}

	_focusWatcher(focus){
		if(focus){
			// getting the focus
			this._keyPressHandle = connect(this._dom.root, "keypress", (e) =>{
				if(e.keyCode === 32){
					this._onClick(e);
				}
			})
		}else{
			// losing the focus
			this._keyPressHandle && this._keyPressHandle.destroy();
			delete this._keyPressHandle;
		}
	}

	_onClick(e){
		stopEvent(e);

		if(!this.enabled) return;

		let states = this._states;
		this.value =
			states[(states.indexOf(this._value) + 1) % states.length];
		this._applyHandlers({name: "onClick", domEventObject: e});
	}
}

StateButton.className = "bd-state-button";
