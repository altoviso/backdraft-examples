import {render, e} from "./backdraft.js"
import HelloWorld from "./HelloWorld.js"

let translations = {
	"default": "Hello world",
	"Italian": "Ciao mondo",
	"French": "Bonjour le monde",
	"Spanish": "Hola Mundo",
	"German": "Hallo Welt",
	"Swedish": "Hej världen",
	"Russian": "Привет мир",
	"Japanese": "こんにちは世界"
};

let helloWorld = render(HelloWorld, {translations}, document.getElementById("root"));
let counter = 0;
let languageChoices = Object.keys(translations);
let intervalId = setInterval(function(){
	if(++counter < languageChoices.length){
		helloWorld.language = languageChoices[counter];
	}else{
		clearInterval(intervalId);
		helloWorld.destroy();
		render(e("div", "that's all folks!"), document.getElementById("root"));
	}
}, 1000);
