import {render, e} from "./backdraft.js"

render(
	e("div", {className: "hello-world"},
		e("p", "hello world")
	),
	document.getElementById("root")
);
