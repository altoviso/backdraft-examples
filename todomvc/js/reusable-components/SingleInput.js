import {Component, e, stopEvent} from "../backdraft.js";

export default class SingleInput extends Component {
	bdElements(){
		return e("input", {
			value: this.kwargs.value,
			bdOn: {
				keydown: this._onKeyDown.bind(this),
				blur: this._onKeyDown.bind(this, null)
			}
		});
	}

	_onKeyDown(e){
		const ESCAPE_KEY = 27;
		const ENTER_KEY = 13;

		let kwargs = this.kwargs;
		if(!e || e.keyCode === ENTER_KEY){
			stopEvent(e);
			kwargs.finish(this.bdDom.root.value.trim() || kwargs.value);
		}else if(e.keyCode === ESCAPE_KEY){
			stopEvent(e);
			kwargs.finish(kwargs.value);
		}
	}
}
SingleInput.className = "bd-single-input";
