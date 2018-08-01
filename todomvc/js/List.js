import {Component, e, stopEvent} from "./backdraft.js"
import Button from "./reusable-components/Button.js";
import TwoStateButton from "./reusable-components/TwoStateButton.js";
import SingleInput from "./reusable-components/SingleInput.js";

class CompletedButton extends TwoStateButton {
	constructor(kwargs){
		super(kwargs);
		this.own(kwargs.todoItem.watch("completed", (newValue) => (this.value = newValue)));
	}

	_onClick(e){
		stopEvent(e);
		this.kwargs.todoItem.completed = !this.kwargs.todoItem.completed;
	}
}
CompletedButton.className = "bd-completed";

class Item extends Component {
	_elements(){
		let item = this.kwargs.todoItem;
		return e("div", {className: "bd-todo-list-item"},
			e(CompletedButton, {value: item.completed, todoItem: item}),
			e("p", {[e.attach]: "textNode", [e.advise]: {dblclick: this._edit.bind(this)}}, item.text),
			e(Button, {className: "delete-button", handler: () => this.parent.deleteItem(item)})
		);
	}

	postRender(){
		this._setItemCompletedState();
		return [
			this.kwargs.todoItem.watch("text", (newValue) => (this.textNode.textContent = newValue)),
			this.kwargs.todoItem.watch("completed", this._setItemCompletedState.bind(this))
		];
	}

	_setItemCompletedState(){
		this[this.kwargs.todoItem.completed ? "addClassName" : "removeClassName"]("completed");
	}

	_edit(){
		this.addClassName("edit");
		let edit = new SingleInput({
			value: this.kwargs.todoItem.text,
			className: "new-todo",
			finish: (result) =>{
				this.removeClassName("edit");
				this.kwargs.todoItem.text = result;
				this.delChild(edit);
			}
		});
		this.insChild(edit);
	}
}

export default class List extends Component {
	_elements(){
		return e("div", {className: "bd-todo-list"});
	}

	postRender(){
		let model = this.kwargs.model;

		model.getItems().forEach((item) =>{
			this.insChild(new Item({todoItem: item}));
		});

		return [
			model.advise("item-inserted", (e) => this.insChild(new Item({todoItem: e.item}))),

			model.advise("item-deleted", (e) =>{
				this.children.some((child) =>{
					if(child.kwargs.todoItem === e.item){
						this.delChild(child, true);
						return true;
					}
				})
			})
		];
	}

	deleteItem(item){
		this.kwargs.model.delItem(item);
	}
}
