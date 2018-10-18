import {Component, e} from "./backdraft.js";

export default class HelloWorld extends Component.withWatchables("language") {
	bdElements(){
		let translations = this.kwargs.translations;
		return e("div", {
			bdReflect: ["language", language => translations[language] || ""],
			bdReflectClass: ["language", language => translations[language] ? language : "empty"]
		});
	}
}

