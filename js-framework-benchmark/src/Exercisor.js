import {Component, e} from "./backdraft.js"
import Row from "./Row.js"
import {run, runLots, add, update, swapRows, deleteRow} from "./utils.js"

let startTime;
let lastMeasure;
let startMeasure = function(name){
	startTime = performance.now();
	lastMeasure = name;
};
let stopMeasure = function(){
	let last = lastMeasure;
	if(lastMeasure){
		window.setTimeout(function(){
			lastMeasure = null;
			let stop = performance.now();
			let duration = 0;
			console.log(last + " took " + (stop - startTime));
		}, 0);
	}
};

export default class Exercisor extends Component {
	constructor(kwargs){
		super(kwargs);
		this.dataId = 1;
		this.data = [];
		this.selected = null;
	}

	printDuration(){
		stopMeasure();
	}

	run(){
		startMeasure("run");
		this.clear();
		this.add(run);
	}

	runLots(event){
		startMeasure("runLots");
		this.clear();
		this.add(runLots);
	}

	add(dataProc){
		startMeasure(dataProc===add ? "add" : "add lots");
		const obj = dataProc(this.dataId, this.data);
		this.dataId = obj.id;
		this.data = obj.data;
		this.data.slice((this.children && this.children.length) || 0).forEach((row) => this.insChild(e(Row, {
			id: row.id,
			label: row.label
		}), this._bodyNode));
		this.printDuration();
	}

	update(){
		startMeasure("update");
		const data = update(this.data);
		this.data.forEach((row, i) => this.children[i].label = row.label);
		this.printDuration();

	}

	select(id){
		startMeasure("select");
		if(this.selected){
			this.selected.select = false;
		}
		const newSelected = this.children.find((row) => row.id === id);
		newSelected && (this.selected = newSelected);
	}

	delete(id){
		startMeasure("delete");
		this.data.some((row, i) =>{
			if(row.id === id){
				this.delChild(row);
				this.data.splice(i, 1);
				return true;
			}
			return false;
		});
	}

	clear(){
		startMeasure("clear");
		this.children && this.children.slice().forEach((child) => child.destroy());
		this.data = [];
		this.selected = null;
	}

	swapRows(){
		startMeasure("swapRows");
		const data = this.data = swapRows(this.data);
		let map = new Map();
		this.children.forEach((row) => map.set(row.id, row));
		this.reorderChildren(data.map((row) => map.get(row.id)));
		this.printDuration();
	}

	render(){
		startMeasure("initial render");
		super.render();
		this.printDuration();
	}

	get elements(){
		return e("div", {className: "container"},
			e("div", {className: "jumbotron"},
				e("div", {className: "row"},
					e("div", {className: "col-md-6"},
						e("h1", "backdraft")
					),
					e("div", {className: "col-md-6"},
						e("div", {className: "row"},
							[
								{id: "run", label: "Create 1,000 rows", proc: this.run.bind(this)},
								{id: "runlots", label: "Create 10,000 rows", proc: this.runLots.bind(this)},
								{id: "add", label: "Append 1,000 rows", proc: this.add.bind(this, add)},
								{id: "update", label: "Update every 10th row", proc: this.update.bind(this)},
								{id: "clear", label: "Clear", proc: this.clear.bind(this)},
								{id: "swaprows", label: "Swap Rows", proc: this.swapRows.bind(this)},
							].map((action) => e("div", {className: "col-sm-6 smallpad"},
								e("button", {
									type: "button",
									id: action.id,
									className: "btn btn-primary btn-block",
									[e.advise]: {click: action.proc}
								}, action.label)
							))
						)
					)
				)
			),
			e("table", {className: "table table-hover table-striped test-data"},
				e("tbody", {[e.attach]: "_bodyNode"},
					this.data.map((row) => e(Row, {
						data: row,
						selected: row.id === this.selectedRowId,
						[e.advise]: {
							select: (e) => this.select(e.id),
							delete: (e) => this.delete(e.id)
						}
					}))
				)
			),
			e("span", {className: "preloadicon glyphicon glyphicon-remove", "aria-hidden": true})
		);
	}
}
