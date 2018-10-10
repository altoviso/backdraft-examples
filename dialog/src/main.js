import {render, toWatchable} from "./backdraft.js";
import FileList from "./FileList.js";
import Log from "./Log.js";

// in a real program, files would be the result of some service call to get a set of files...
let files = [
	[1737, [2018, 9, 5, 9, 31], "Collection.js"],
	[25187, [2018, 9, 8, 19, 6], "Component.js"],
	[1715, [2018, 9, 7, 14, 28], "EventHub.js"],
	[546, [2018, 9, 5, 6, 59], "destroyable.js"],
	[13729, [2018, 9, 8, 22, 4], "dom.js"],
	[3597, [2018, 9, 8, 11, 31], "element.js"],
	[1043, [2018, 9, 8, 12, 8], "postProcessingCatalog.js"],
	[11776, [2018, 9, 8, 12, 15], "watchUtils.js"]
];

// convert the service data to something that works better for us
files =
	//files.map(item => ({size: item[0], modified: new Date(item[1]), name: item[2]}))
	files.map(item => ({size: item[0], modified: (new Date(...item[1])).getTime(), name: item[2]}));

// make it watchable
files = toWatchable(files);

render(FileList, {files: files}, "files");
render(Log, {files: files}, "log");
