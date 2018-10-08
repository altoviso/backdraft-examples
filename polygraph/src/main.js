import {Component, Collection, render, svg, e, watch, toWatchable} from "./backdraft.js";

// The raw data to observe
let stats = window.z = toWatchable([
	{label: "A", value: 100},
	{label: "B", value: 100},
	{label: "C", value: 100},
	{label: "D", value: 100},
	{label: "E", value: 100},
	{label: "F", value: 100}
]);

function valueToPoint(value, index, total){
	let x = 0;
	let y = -value * 0.8;
	let angle = Math.PI * 2 / total * index;
	let cos = Math.cos(angle);
	let sin = Math.sin(angle);
	return {x: x * cos - y * sin + 100, y: x * sin + y * cos + 100};
}

class AxisLabel extends Component.withWatchables("label") {
	constructor(kwargs){
		super(kwargs);
		this.calc(true);
		this.own(watch(this.collection, ["length", this.kwargs.index], this.calc.bind(this)));
	}

	bdElements(){
		return svg("text", {
			bdReflect: {
				x: ["label", p => p.x],
				y: ["label", p => p.y],
				innerHTML: ["label", p => p.label]
			}
		});
	}

	calc(){
		let stat = this.collection[this.kwargs.index];
		if(stat){
			if(!this.watchHandle || this.watchHandle.stat !== stat){
				this.watchHandle && this.watchHandle.destroy();
				this.own(this.watchHandle = watch(stat, this.calc.bind(this)));
				this.watchHandle.stat = stat;
			}
			let label = valueToPoint(stat.value + 10, this.kwargs.index, this.collection.length);
			label.label = stat.label;
			this.bdMutate("label", "_label", label);
		}
	}
}

class Polygraph extends Component {
	bdElements(){
		let pointsToPolyPoints = (stats) => {
			let length = stats.length;
			return stats.map((s, i) => valueToPoint(s.value, i, length)).map(p => p.x + "," + p.y).join(" ");
		};
		return svg("svg", {width: 200, height: 200},
			svg("g", {bdChildrenAttachPoint: true},
				svg("polygon", {bdReflect_points: [this.kwargs.stats, pointsToPolyPoints]}),
				svg("circle", {cx: 100, cy: 100, r: 80}),
				e(Collection, {root: svg("g"), childType: AxisLabel, collection: this.kwargs.stats})
			)
		);
	}
}

class StatController extends Component.withWatchables("stat") {
	constructor(kwargs){
		super(kwargs);
		this.stat = this.collection[this.kwargs.index];
		this.own(watch(this.collection, this.kwargs.index, stat => (this.stat = stat)));
	}

	bdElements(){
		return e("div",
			e("label", {bdReflect: ["stat", stat => stat.label]}),
			e("input", {
				type: "range", min: 0, max: 100, value: this.stat.value,
				bdOn_input: e => (this.stat.value = Number(e.target.value))
			}),
			e("div", {className: "value", bdReflect: ["stat", stat => stat.value]}),
			e("button", {className: "remove", bdOn_click: this.remove.bind(this)}, "X")
		);
	}

	remove(){
		if(this.collection.length > 3){
			this.collection.splice(this.kwargs.index, 1);
		}else{
			alert("Can't delete more!");
		}
	}
}

class Page extends Component {
	bdElements(){
		return e("div",
			e(Polygraph, {bdAttach: "graph", stats: this.kwargs.stats}),
			e(Collection, {childType: StatController, collection: this.kwargs.stats}),
			e("form",
				e("input", {bdAttach: "input"}),
				e("button", {bdAdvise: {"click": this.add.bind(this)}}, "Add a Stat")
			),
			e("pre", {
				className: "raw",
				bdReflect: [this.kwargs.stats, () => JSON.stringify(stats, null, "\t")]
			})
		);
	}

	add(e){
		e.preventDefault();
		let label = this.input.value;
		if(!label) return;
		this.kwargs.stats.push({label: label, value: 100});
		this.input.value = "";
	}
}

render(Page, {stats: stats}, "root");
