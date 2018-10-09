import {render, toWatchable} from "./backdraft.js";
import FileList from "./FileList.js";
import Log from "./Log.js";

// in a real program, files would be the result of some service call to get a set of files...
let files =	[
	[1737, "5-10-2018 09:31", "Collection.js"],
	[25187, "8-10-2018 19:06", "Component.js"],
	[1715, "7-10-2018 14:28", "EventHub.js"],
	[546, "5-10-2018 06:59", "destroyable.js"],
	[13729, "8-10-2018 22:04", "dom.js"],
	[3597, "8-10-2018 11:31", "element.js"],
	[1043, "8-10-2018 12:08", "postProcessingCatalog.js"],
	[11776, "8-10-2018 12:15", "watchUtils.js"]
];

// convert the service data to something that works better for us
files =
	//files.map(item => ({size: item[0], modified: new Date(item[1]), name: item[2]}))
	files.map(item => ({size: item[0], modified: (new Date(item[1])).getTime(), name: item[2]}));

// make it watchable
files = toWatchable(files);

render(FileList, {files:files}, "files");
render(Log, {files:files}, "log");
