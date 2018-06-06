import {render, e, focusManager} from "./backdraft.js"
import StateButton from "./StateButton.js"

// let someButton = render(StateButton, document.getElementById("root"));
// someButton.advise("onClick", function(e){
// 	console.log(e);
// });

let elements = e("div",
	e(StateButton, {uid: 1, tabIndex: 1, label: "Button-1"}),
	e(StateButton, {uid: 2, tabIndex: 2, label: "Button-2"})
);


let someButton = render(elements, document.getElementById("root"));
someButton.advise("onClick", function(e){
	console.log(e);
});

focusManager.advise("focusComponent", (e) => console.log("focusComponent", e));
focusManager.advise("blurComponent", (e) => console.log("blurComponent", e));
