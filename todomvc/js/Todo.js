import {Component, e, stopEvent} from "./backdraft.js"
import Button from "./reusable-components/Button.js";
import TwoStateButton from "./reusable-components/TwoStateButton.js";
import RadioGroup from "./reusable-components/RadioGroup.js";
import List from "./List.js"

export default class ToDo extends Component {
	_elements(){
		return e("div", {className: "bd-todo"},
			e("div",
				e(TwoStateButton, {
					className: "bd-toggle-all",
					[e.watch]: {value: (completeAll) => this.kwargs.model.setCompleteAll(completeAll)}
				}),
				e("input", {
					className: "new-todo",
					placeholder: "What needs to be done?",
					autofocus: true,
					[e.attach]: "_inputNode",
					[e.advise]: {keydown: this._onKeyDown.bind(this)}
				})
			),
			e(List, {model: this.kwargs.model}),
			e("div", {className: "bd-footer"},
				e("div", {[e.attach]: "_itemsLeftNode"}),
				e("div",
					e(RadioGroup, {
						value: "All",
						group: [{label: "All"}, {label: "Active"}, {label: "Completed"}],
						[e.watch]: {value: (value) => this.setFilter(value.toLowerCase())}
					})
				),
				e(Button, {
					className: "bd-clear-completed",
					label: "Clear completed",
					handler: () => this.kwargs.model.removeCompleted()
				})
			)
		);
	}

	postRender(){
		this._updateMessageCounts();
		return this.kwargs.model.advise(["item-inserted", "item-deleted", "item-complete-mutate"], this._updateMessageCounts.bind(this));
	}

	setFilter(filter){
		this.removeClassName("completed", "active", "all").addClassName(filter)
	}

	_updateMessageCounts(){
		let itemsLeft = this.kwargs.model.incompleteItemCount;
		this._itemsLeftNode.textContent = itemsLeft + " item" + (itemsLeft === 1 ? "" : "s") + " left";
		this[this.kwargs.model.count === itemsLeft ? "addClassName" : "removeClassName"]("no-completed-items");
	}

	_onKeyDown(e){
		let ENTER_KEY = 13;
		if(event.keyCode === ENTER_KEY){
			stopEvent(e);
			let val = this._inputNode.value.trim();
			if(val){
				this.kwargs.model.insItem(val);
				this._inputNode.value = "";
			}
		}
	}
}
