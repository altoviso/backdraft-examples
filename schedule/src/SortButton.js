import {Component, e} from "./backdraft.js";

let stateToUiClass = {
	unsorted: "icon-sort-none",
	ascending: "icon-sort-asc",
	descending: "icon-sort-desc"
};

export default class SortButton extends Component.withWatchables("state") {
	bdElements(){
		return e(
			"div", {
				className: "bdt-state-button",
				bdReflectClass: ["state", (state) => stateToUiClass[state]],
				bdOn_click: () => this.kwargs.action(this)
			}, e("div", this.kwargs.label)
		);
	}
}
