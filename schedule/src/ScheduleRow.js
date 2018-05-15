import {Component, e} from "./backdraft.js"

let month = "Jan.Feb.Mar.Apr.May.Jun.Jul.Aug.Sep.Oct.Nov.Dec".split(".");

function getDate(rowData){
	return month[rowData.time.getMonth()] + " " + rowData.time.getDate()
}

function getTime(rowData){
	let hours = rowData.time.getHours();
	let mins = rowData.time.getMinutes();
	return (hours > 12 ? hours - 12 : hours) + ":" + (mins < 10 ? "0" + mins : mins);
}

export default class ScheduleRow extends Component {
	static getSortFunc(prop, order){
		return (lhs, rhs) =>{
			lhs = lhs.kwargs.data;
			rhs = rhs.kwargs.data;
			if(lhs[prop] < rhs[prop]){
				return order;
			}else if(lhs[prop] > rhs[prop]){
				return -order;
			}else if(lhs.location < rhs.location){
				return -1;
			}else if(lhs.location > rhs.location){
				return -1;
			}else{
				return 0;
			}
		}
	}

	get elements(){
		let rowData = this.kwargs.data;
		return e("tr",
			e("td", getDate(rowData)),
			e("td", getTime(rowData)),
			e("td", rowData.away),
			e("td", rowData.home),
			e("td", rowData.location)
		);
	}
}