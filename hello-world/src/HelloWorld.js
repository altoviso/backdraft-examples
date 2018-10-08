import {Component, e} from "./backdraft.js";


export default class HelloWorld extends Component.withWatchables("language", "translations", "translation") {
	constructor(kwargs){
		super(kwargs);
		let translate = () => {
			this.translation =
				(this.translations && this.translations[this.language]) || "";
		};
		translate();
		this.watch({language: translate, translations: translate});
	}

	bdElements(){
		return e("div", {
			className: "helloWorld",
			bdReflect: "translation",
			bdReflectClass: [
				"language",
				"translation", translation => translation ? "" : "empty",
				"translations", translations => translations ? "" : "no-translations",
			]
		});
	}
}

