import {Component, e, stopEvent} from "../backdraft.js"

export default class SingleInput extends Component {
	get elements(){
		return e("input", {
			value: this.kwargs.value,
			[e.advise]: {
				keydown: this._onKeyDown.bind(this),
				blur: this._onKeyDown.bind(this, null)
			}
		})
	}

	postRender(){
		setTimeout(() => this._dom.root.focus(), 100);
	}

	_onKeyDown(e){
		const ESCAPE_KEY = 27;
		const ENTER_KEY = 13;

		if(!e || e.keyCode === ENTER_KEY){
			stopEvent(e);
			this.kwargs.finish(this._dom.root.value.trim() || this.kwargs.value)
		}else if(e.keyCode === ESCAPE_KEY){
			stopEvent(e);
			this.kwargs.finish(this.kwargs.value)
		}
	}
}
SingleInput.className = "bd-single-input";
