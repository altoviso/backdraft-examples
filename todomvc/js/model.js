import {WatchHub, EventHub} from "./backdraft.js"

let uidSeed = 0;
function getUid(){
	return ++uidSeed;
}

class Item extends WatchHub() {
	constructor(id, completed, text){
		super();

		// immutable
		Object.defineProperties(this, {
			id: {value: id, enumerable: true},
		});

		// protected
		this._text = text;
		this._completed = completed;
	}

	destroy(){
		this.destroyWatch();
	}

	get text(){
		return this._text;
	}

	set text(newValue){
		this._applyWatchers("text", "_text", newValue);
	}

	get completed(){
		return this._completed;
	}

	set completed(newValue){
		this._applyWatchers("completed", "_completed", newValue);
	}
}

class Model extends EventHub() {
	constructor(storageId){
		super();
		this._storageId = storageId;
		this._items = [];
		let persistentData = localStorage.getItem(storageId);
		if(persistentData){
			JSON.parse(persistentData).forEach((item) => this.insItem(...item));
			uidSeed =  this._items.reduce((acc, item) => Math.max(acc, item.id), 0);
		}
	}

	persist(){
		localStorage.setItem(this._storageId, JSON.stringify(this._items.map((item)=>[item.id, item.completed, item.text])));
	}

	getItems(){
		return this._items.slice();
	}

	get count(){
		return this._items.length;
	}

	insItem(id, completed, text){
		if(arguments.length===1){
			text = id;
			id = getUid();
			completed = false;
		}
		let item = new Item(id, completed, text);
		this._items.push(item);
		item.watch("completed", () =>{
			this._applyHandlers({name: "item-complete-mutate", item: item});
			this.persist();
		});
		item.watch("text", () =>{
			this.persist();
		});
		this._applyHandlers({name: "item-inserted", item: item});
		this.persist();
	}

	delItem(target){
		if(this._items.some((item, index)=>(item===target && this._items.splice(index, 1)))){
			this._applyHandlers({name: "item-deleted", item: target});
			this.persist();
			target.destroy();
		}
	}

	setCompleteAll(value){
		this._items.forEach((item) => (item.completed = value))
	}

	removeCompleted(){
		this._items.slice().forEach((item) => item.completed && this.delItem(item));
	}

	get incompleteItemCount(){
		return this._items.reduce((acc, item) => (item.completed ? acc : ++acc), 0);
	}
}

let model = new Model("todos-backdraft");
export default model;
