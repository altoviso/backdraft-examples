import {Component, e, render} from "./backdraft.js";
import Grid from "./Grid.js"
import SortButton from "./SortButton.js";
import {data} from "../data/scheduleData.js"

let month = "Jan.Feb.Mar.Apr.May.Jun.Jul.Aug.Sep.Oct.Nov.Dec".split(".");

function getDate(rowData){
	return rowData ? month[rowData.time.getMonth()] + " " + rowData.time.getDate() : "";
}

function getTime(rowData){
	if(!rowData){
		return "";
	}
	let hours = rowData.time.getHours();
	let mins = rowData.time.getMinutes();
	return (hours > 12 ? hours - 12 : hours) + ":" + (mins < 10 ? "0" + mins : mins);
}

let schedule = render(Grid, {
		className: "schedule",
		columnNames: ["date", "time", "away", "home", "location"],
		headers: [
			e(SortButton, {
				label: "Date",
				[e.attach]: "_dateSortButton",
				[e.advise]: {
					//"click": this._demandSort.bind(this)
				}
			}),
			e("div", "Time"),
			e(SortButton, {
				label: "Away",
				[e.attach]: "_awaySortButton",
				[e.advise]: {
					//"click": this._demandSort.bind(this)
				}
			}),
			e(SortButton, {
				label: "Home",
				[e.attach]: "_homeSortButton",
				[e.advise]: {
					//"click": this._demandSort.bind(this)
				}
			}),
			e("div", "Location"),
			e("div", "Id")
		],
		columns: [
			e(Grid.StaticCell, {dataRef: getDate}),
			e(Grid.StaticCell, {dataRef: getTime}),
			e(Grid.StaticCell, {dataRef: "away"}),
			e(Grid.StaticCell, {dataRef: "home"}),
			e(Grid.StaticCell, {dataRef: "location"}),
			e(Grid.StaticCell, {dataRef: "id"})
		]
	},
	document.getElementById("root")
);

let bigData = [];
for(let i = 0, count = 0; i<100; i++) bigData = bigData.concat(data.map(item=>Object.assign({}, item, {id:count++})));
//schedule.data = data;
schedule.data = bigData;
