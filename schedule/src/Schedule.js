import {Component, e} from "./backdraft.js"
import ScheduleHeader from "./ScheduleHeader.js"
import ScheduleData from "./ScheduleData.js"

export default class Schedule extends Component {
	_elements(){
		return e("table",
			e(ScheduleHeader, {
				[e.watch]: {
					sort: (sort) => this._data.sort(sort.column, sort.order)
				}
			}),
			e(ScheduleData, {[e.attach]: "_data", data: this.kwargs.data})
		);
	}
}
