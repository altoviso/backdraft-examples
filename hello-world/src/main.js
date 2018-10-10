import {render} from "./backdraft.js";
import HelloWorld from "./HelloWorld.js";

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

let helloWorld = render(HelloWorld, {translations}, document.getElementById("rotate"));
let counter = 0;
let languageChoices = Object.keys(translations);
setInterval(function(){
	helloWorld.language = languageChoices[(counter = ++counter % languageChoices.length)];
}, 1000);

window.helloWorld = render(HelloWorld, {translations}, document.getElementById("static"));

