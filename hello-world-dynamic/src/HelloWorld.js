import {Component, e} from "./backdraft.js"

export default class HelloWorld extends Component {
	get language(){
		return this._language || null;
	}

	set language(value){
		this._language = this.className = value;
		if(this.rendered){
			this._dom.root.innerHTML = this._getTranslation();
		}
	}

	get elements(){
		return e("div", this._getTranslation());
	}

	_getTranslation(){
		return this.kwargs.translations[this._language] || "hello world";
	}
}
