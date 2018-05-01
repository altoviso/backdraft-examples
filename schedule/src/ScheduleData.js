import {Component, e} from "./backdraft.js"
import ScheduleRow from "./ScheduleRow.js"

export default class ScheduleData extends Component {
	get elements(){
		return e("tbody", this.kwargs.data.map((rowData) => e(ScheduleRow, {data: rowData})));
	}

	sort(column, order){
		this.reorderChildren(
			this.children.slice().sort(ScheduleRow.getSortFunc(column, order==="ascending" ? -1 : 1))
		)
	}
}


