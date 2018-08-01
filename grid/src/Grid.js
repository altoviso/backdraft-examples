import {Component, e, getPosit} from "./backdraft.js"
import Scrollbar from "./Scrollbar.js"

class StaticCell extends Component {
	setData(data){
		let dataRef = this.kwargs.dataRef;
		this._dom.root.innerHTML = typeof dataRef === "function" ? dataRef(data) : (data !== undefined ? data[dataRef].toString() : "");
		this[data === undefined ? "addClassName" : "removeClassName"]("no-data");
	}
}

StaticCell.className = "bd-static-cell";

class Row extends Component {
	_elements(){
		return e("div", {className: "row"},
			this.kwargs.columns.map((column, columnIndex) =>{
				return e("div", {className: this.kwargs.columnNames[columnIndex]}, column);
			})
		);
	}

	setData(data){
		this.children.forEach(cell => cell.setData(data));
	}
}

export default class Grid extends Component {
	constructor(kwargs){
		super(kwargs);

		// kwargs.headers is an array of elements that describe the header for each column
		// kwargs.headers.length gives the number of columns

		// kwargs.data (if any) gives an array of data to display in the grid

		// kwargs.columns is an array of elements that describe how to create a data cell for each column
		// it must have the public method setData(data) which receives an item from data

		this._topRow = 0;
		this._maxRow = 0;
		this.dataRows = [];
	}

	get data(){
		return this._data;
	}

	set data(value){
		if(value !== this._data){
			this._data = value;
			let rowIndex = this._topRow = 0;
			if(this.rendered){
				this.scrollbar.setPosit(0);
				if(value && value.length){
					while(value.length < this.dataRows.length){
						this.delChild(this.dataRows.pop())
					}
					this.dataRows.forEach(row => row.setData(this._data[rowIndex++]));
					this._populateRows(rowIndex);
				}else{
					this.clear();
				}
			}
		}

	}

	get topRow(){
		return this._topRow;
	}

	set topRow(value){
		if(this.rendered){
			value = Math.min(Math.max(value, 0), this._maxRow);
		}
		let prevTopRow = this._topRow;
		let delta = value - prevTopRow;
		let dataRows = this.dataRows;
		if(this._applyWatchers("topRow", "_topRow", value) && this.rendered){
			this.scrollbar.setPosit(value);
			if(Math.abs(delta) >= dataRows.length){
				// all the data in all the rows is going to be replaced, so just update the data
				dataRows.forEach((row, i) => row.setData(this._data[value + i]));
			}else if(delta > 0){
				// take rows off the top and put them at the bottom
				for(let i = 0, dataIndex = prevTopRow + dataRows.length; i < delta; i++){
					let child = dataRows.shift();
					this.rowsInnerNode.appendChild(child._dom.root);
					child.setData(this._data[dataIndex++]);
					dataRows.push(child);
				}
			}else{
				// take rows off the bottom and put them at the top
				delta = -delta;
				for(let i = 0, dataIndex = prevTopRow - 1; i < delta; i++){
					let child = dataRows.pop();
					this.rowsInnerNode.insertBefore(child._dom.root, dataRows[0]._dom.root);
					child.setData(this._data[dataIndex--]);
					dataRows.unshift(child);
				}
			}
		}
	}

	rowUp(){
		this.topRow = this.topRow - 1;
	}

	rowDown(){
		this.topRow = this.topRow + 1;
	}

	pageUp(){
		this.topRow = this.topRow - this.dataRows.length + 2;
	}

	pageDown(){
		this.topRow = this.topRow + this.dataRows.length - 2;
	}

	_elements(){
		return e("div", {className: "bd-grid"},
			e("div", {className: "header", [e.attach]: "headerNode"}, this.kwargs.headers.map((header, columnIndex) =>{
				return e("div", {className: this.kwargs.columnNames[columnIndex]}, header);
			}), e("div", {className: "bd-scrollbar-spacer"})),
			e("div", {className: "body"},
				e("div", {className: "rows-outer", [e.attach]: "rowsOuterNode"},
					e("div", {className: "rows-inner", [e.attach]: "rowsInnerNode"})
				),
				e(Scrollbar, {
					[e.attach]: "scrollbar",
					[e.advise]: {
						rowUp: ()=>this.topRow = this.topRow - 1,
						rowDown: ()=>this.topRow = this.topRow + 1,
						pageUp: this.pageUp.bind(this),
						pageDown: this.pageDown.bind(this),
						rowSet: (event)=>this.topRow = event.value
					}
				})
			)
		);
	}

	_attachToDoc(value){
		if(super._attachToDoc(value)){
			if(this.attachedToDoc){
				if(this._data){
					this._populateRows(this._topRow);
				}
			}else{
				this.clear();
			}
		}
	}

	_clear(){
		this._topRow = 0;
		this.dataRows.forEach(row => this.delChild(row));
		this.dataRows = [];
	}

	_overflow(){
		return getPosit(this.rowsOuterNode).h < getPosit(this.rowsInnerNode).h;
	}

	_populateRows(rowIndex){
		while(rowIndex < this._data.length && !this._overflow()){
			this._createRow(rowIndex++);
		}
		this.scrollbar.setMaxRows(this._maxRow = this._data.length - this.dataRows.length + 1);
	}

	_createRow(rowIndex){
		let row = this.insChild(Row, {
			columns: this.kwargs.columns,
			columnNames: this.kwargs.columnNames
		}, "rowsInnerNode");
		this._data && this._data.length > rowIndex && row.setData(this._data[rowIndex]);
		this.dataRows.push(row);
	}
}

Grid.StaticCell = StaticCell;
