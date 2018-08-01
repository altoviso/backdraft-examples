import {Component, e} from "./backdraft.js"
import SortButton from "./SortButton.js"

const UNSORTED = 0;
const ASCENDING = 1;
const DESCENDING = 2;

export default class ScheduleHeader extends Component {
	constructor(kwargs){
		super(kwargs);
		this._sort = {column: "time", order: "ascending"};
	}

	_elements(){
		return e("thead",
			e("tr", {className: "header"},
				e("th", e(SortButton, {
					label: "Date",
					[e.attach]: "_dateSortButton",
					[e.advise]: {
						"click": this._demandSort.bind(this)
					}
				})),
				e("th", e("div", "Time")),
				e("th", e(SortButton, {
					label: "Away",
					[e.attach]: "_awaySortButton",
					[e.advise]: {
						"click": this._demandSort.bind(this)
					}
				})),
				e("th", e(SortButton, {
					label: "Home",
					[e.attach]: "_homeSortButton",
					[e.advise]: {
						"click": this._demandSort.bind(this)
					}
				})),
				e("th", e("div", "Location"))
			),
		);
	}

	postRender(){
		this._setButtonStates(this._sort.column, this._sort.order === "ascending" ? ASCENDING : DESCENDING);
	}

	get sort(){
		return this._sort;
	}

	set sort(value){
		if(value.column !== this._sort.column || value.order !== this._sort.order){
			this._setButtonStates(value.column, value.order === "ascending" ? ASCENDING : DESCENDING);
			let oldValue = this._sort;
			this._sort = value;
			this._applyWatchersRaw("sort", oldValue, this._sort);
		}
	}

	_setButtonStates(sortColumn, sortOrder){
		this._dateSortButton.state = (sortColumn === "time" ? sortOrder : UNSORTED);
		this._awaySortButton.state = (sortColumn === "away" ? sortOrder : UNSORTED);
		this._homeSortButton.state = (sortColumn === "home" ? sortOrder : UNSORTED);
	}

	_demandSort(e){
		// target is the button that was demanded
		let target = e.target;

		// ascending -> descending; no-order or descending -> ascending
		if(target.state === ASCENDING){
			target.state = DESCENDING;
		}else{
			target.state = ASCENDING;
		}

		this.sort = {
			column: target === this._dateSortButton ? "time" : (target === this._awaySortButton ? "away" : "home"),
			order: target.state === ASCENDING ? "ascending" : "descending"
		};
	}
}
