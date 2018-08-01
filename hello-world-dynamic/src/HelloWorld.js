import {Component, e} from "./backdraft.js"

export default class HelloWorld extends Component {
	//
	// “hello, world” in any language given by a set of translations
	// default to English if a demanded translation doesn’t exist
	//
	// construction kwargs:
	//     translations
	//          [hash:language -> <hello, world, in language>(string)]
	//
	get language(){
		return this._language || null;
	}

	set language(value){
		this._language = this.className = value;
		if(this.rendered){
			this._dom.root.innerHTML = this._getTranslation();
		}
	}

	_elements(){
		return e("div", this._getTranslation());
	}

	_getTranslation(){
		return this.kwargs.translations[this._language] || "hello world";
	}
}
