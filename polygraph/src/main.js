import {Component, Collection, CollectionChild, render, svg, e, toWatchable} from "./backdraft.js";

// This is a port of the Vue example of the same name.
// Other than the mathematical calculation of a point (which is a property of mathematics, not the example), it shares no common code.

// The raw data to observe
// window.polygraphData allows the data to be mutated in the debug console
let stats = window.polygraphData = toWatchable([
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
	return {x: Math.round(x * cos - y * sin + 100), y: Math.round(x * sin + y * cos + 100)};
}

class AxisLabel extends CollectionChild.withWatchables("item:label", "item:value", "point") {
	bdElements(){
		// reflect the value of this.label into a svg text node
		this.onMutateValue(this.value);
		return svg("text", {
			bdReflect: {
				x: ["point", p => p.x],
				y: ["point", p => p.y],
				innerHTML: "label"
			}
		});
	}

	onMutateValue(value){
		// update this.point
		this.point = valueToPoint((value || 0) + 10, this.collectionIndex, this.collectionLength);
	}

	onMutateCollectionLength(){
		this.onMutateValue(this.value);
	}

	onMutateCollectionIndex(){
		this.onMutateValue(this.value);
	}
}

class Polygraph extends Component {
	bdElements(){
		function pointsToPolyPoints(stats){
			let length = stats.length;
			return stats.map((s, i) => valueToPoint(s.value, i, length)).map(p => p.x + "," + p.y).join(" ");
		}

		return svg("svg", {width: 200, height: 200},
			svg("g",
				svg("polygon", {bdReflect_points: [this.kwargs.stats, pointsToPolyPoints]}),
				svg("circle", {cx: 100, cy: 100, r: 80}),
				e(Collection, {elements: svg("g"), childType: AxisLabel, collection: this.kwargs.stats})
			)
		);
	}
}

class StatController extends CollectionChild.withWatchables("item:label, value", "point") {
	bdElements(){
		return e("div",
			e("label", {
				bdReflect: "label"
			}),
			e("input", {
				type: "range", min: 0, max: 100, value: this.collectionItem.value,
				bdOn_input: e => (this.collectionItem.value = Number(e.target.value)),
				bdReflect_value: "value"
			}),
			e("div", {
				className: "value", bdReflect: "value"
			}),
			e("button", {className: "remove", bdOn_click: this.remove.bind(this)}, "X")
		);
	}

	remove(){
		if(this.parent.collection.length > 3){
			this.parent.collection.splice(this.collectionIndex, 1);
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

let stack = [];

window.kill = function(){
	stack.pop().destroy();
};

window.add = function(){
	stack.push(render(Page, {stats: stats}, "root"));
}
window.add();
