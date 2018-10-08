import {Component, e} from "./backdraft.js";
import ScheduleHeader from "./ScheduleHeader.js";
import ScheduleData from "./ScheduleData.js";

export default class Schedule extends Component {
	bdElements(){
		return e("table",
			e(ScheduleHeader, {
				sort: {column: "time", order: "ascending"},
				bdWatch_sort: (sort) => this.dataRows.sort(sort.column, sort.order)
			}),
			e(ScheduleData, {bdAttach: "dataRows", data: this.kwargs.data})
		);
	}
}
