import {Component, e, biBind} from "./backdraft.js";
import Button from "./reusable-components/Button.js";
import TwoStateButton from "./reusable-components/TwoStateButton.js";
import SingleInput from "./reusable-components/SingleInput.js";

class CompletedButton extends TwoStateButton {
	constructor(kwargs){
		super(kwargs);
		biBind(kwargs.todoItem, "completed", this, "value");
	}
}

CompletedButton.className = "bd-completed";

class Item extends Component {
	bdElements(){
		let item = this.kwargs.todoItem;
		return e(
			"div", {
				bdReflectClass: [item, "completed", completed => completed ? "completed" : ""]
			},
			e(CompletedButton, {value: item.completed, todoItem: item}),
			e("p", {
				bdOn_dblclick: this.edit.bind(this),
				bdReflect: [item, "text"]
			}),
			e(Button, {className: "delete-button", handler: () => this.parent.deleteItem(item)})
		);
	}

	edit(){
		this.addClassName("edit");
		let finished = false;
		let edit = new SingleInput({
			value: this.kwargs.todoItem.text,
			className: "new-todo",
			finish: (result) => {
				if(!finished){
					finished = true;
					this.removeClassName("edit");
					this.kwargs.todoItem.text = result;
					this.delChild(edit);
				}

			}
		});
		this.insChild(edit);
		setTimeout(() => edit.focus(), 100);
	}
}

Item.className = "bd-todo-list-item";

export default class List extends Component {
	bdElements(){
		return e("div", {className: "bd-todo-list"},
			this.kwargs.model.getItems().map(item => e(Item, {todoItem: item}))
		);
	}

	postRender(){
		let model = this.kwargs.model;
		return [
			model.advise("item-inserted", (e) => this.insChild(new Item({todoItem: e.item}))),

			model.advise("item-deleted", (e) => {
				this.children.some((child) => {
					if(child.kwargs.todoItem === e.item){
						this.delChild(child, true);
						return true;
					}
				});
			})
		];
	}

	deleteItem(item){
		this.kwargs.model.delItem(item);
	}
}
