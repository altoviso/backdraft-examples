import {Component, e, getPosit, setPosit, stopEvent, connect} from "./backdraft.js"

export default class ScrollBar extends Component {
	_elements(){
		return e("div", {className: "bd-scrollbar"},
			e("div", {className: "up-button", [e.advise]: {click: this._onClickUp.bind(this)}}, e("div")),
			e("div", {
					className: "thumb-area",
					[e.attach]: "thumbAreaNode",
					[e.advise]: {click: this._onClickPage.bind(this)}
				},
				e("div", {
					className: "thumb-button",
					[e.attach]: "thumbNode",
					[e.advise]: {mousedown: this._onMouseDown.bind(this)}
				}, e("div"))
			),
			e("div", {className: "down-button", [e.advise]: {click: this._onClickDown.bind(this)}}, e("div"))
		);
	}

	setMaxRows(value){
		this._rowCount = value;
	}

	setPosit(value){
		this._row = value;
		if(this.rendered){
			this.thumbNode.style.top =
				Math.round(value * (getPosit(this.thumbAreaNode).h - getPosit(this.thumbNode).h) / this._rowCount) + "px";
		}
	}

	_onClickUp(){
		stopEvent(event);
		this._applyHandlers({name: "rowUp"});
	}

	_onClickDown(){
		stopEvent(event);
		this._applyHandlers({name: "rowDown"});
	}

	_onClickPage(event){
		stopEvent(event);
		this._applyHandlers({name: event.clientY < getPosit(this.thumbNode).t ? "pageUp" : "pageDown"});
	}

	_onMouseDown(event){
		function move(event){
			stopEvent(event);
			let delta = event.screenY - startY;
			let rowDelta = Math.round(delta / range * this._rowCount);
			this._applyHandlers({name: "rowSet", value:startRow + rowDelta});
		}

		function up(event){
			stopEvent(event);
			h1.destroy();
			h2.destroy();
		}

		stopEvent(event);
		let startY = event.screenY;
		let startRow = this._row;
		let range = getPosit(this.thumbAreaNode).h;
		let h1 = connect(document, "mousemove", move.bind(this), true);
		let h2 = connect(document, "mouseup", up.bind(this), true);
	}
}