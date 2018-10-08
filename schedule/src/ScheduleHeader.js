import {Component, e} from "./backdraft.js";
import SortButton from "./SortButton.js";

export default class ScheduleHeader extends Component.withWatchables("sort") {
	bdElements(){
		let onDemandSort = (column, columnState) => {
			this.sort = {
				column: column,
				order: this.sort.column === column && columnState === "ascending" ? "descending" : "ascending"
			};
		};

		return e("thead",
			e("tr", {className: "header"},
				e("th", e(SortButton, {
					label: "Date",
					bdReflect: {state: ["sort", (sort) => sort.column === "time" ? sort.order : "unsorted"]},
					action: (button) => onDemandSort("time", button.state)
				})),
				e("th", e("div", "Time")),
				e("th", e(SortButton, {
					label: "Away",
					bdReflect: {state: ["sort", (sort) => sort.column === "away" ? sort.order : "unsorted"]},
					action: (button) => onDemandSort("away", button.state)
				})),
				e("th", e(SortButton, {
					label: "Home",
					bdReflect: {state: ["sort", (sort) => sort.column === "home" ? sort.order : "unsorted"]},
					action: (button) => onDemandSort("home", button.state)
				})),
				e("th", e("div", "Location"))
			),
		);
	}
}

