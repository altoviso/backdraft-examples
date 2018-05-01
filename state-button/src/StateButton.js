import {Component, e, connect, stopEvent} from "./backdraft.js"

export default class StateButton extends Component {
	constructor(kwargs){
		super(kwargs);
		this._label = "Button";
		this._states = kwargs.states || ["on", "off"];
		this.value = "value" in kwargs ? kwargs.value : this._states[0];
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
				this.uiClass = newValue + "";
				this._applyWatchersRaw("value", oldValue, this._value)
			}else{
				console.error("illegal value");
			}
		}// else, no change, ignore
	}

	get label(){
		return this._label;
	}


	set label(newValue){
		this._applyWatchers("label", "_label", newValue)
	}

	get elements(){
		return e("div",
			{
				className: "bd-state-button",
				[e.advise]: {"click": this._onClick.bind(this)}
			},
			e("div", {[e.attach]: "_labelNode"}, this._label)
		)
	}

	postRender(){
		this.watch({
			label: (newValue) => (this._labelNode.innerHTML = newValue),
			focus: this._focusWatcher.bind(this)
		});
	}

	_focusWatcher(focus){
		if(focus){
			// getting the focus
			this._keyPressHandle = connect(this._dom.root, "keypress", (e) =>{
				if(true){
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
		let states = this._states;
		this.value =
			states[(states.indexOf(this._value) + 1) % states.length];
		this._applyHandlers({name: "onClick", domEventObject: e});
	}
}
