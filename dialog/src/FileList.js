import {Component, e, Button, Labeled, Input, Dialog} from "./backdraft.js";

function formatTimestamp(ts){
	let d = new Date(ts);
	let pad = x => x > 9 ? x : "0" + x;
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

}

class RenameDialog extends Dialog {
	dialogBody(){
		this.title = "Rename";
		return e("div", {className: "rename-dialog"},
			e("div",
				e(Labeled, {label: "Current Name"},
					e(Input, {value: this.kwargs.currentName, style: "min-width:20em", disabled: true})
				),
				e(Labeled, {label: "New Name"},
					e(Input, {
						bdAttach: "newName",
						value: this.kwargs.currentName,
						placeholder: "enter new name",
						style: "min-width:20em"
					})
				),
			),
			e("div", {className: "bottom-buttons"},
				e(Button, {label: "Cancel", handler: () => this.onCancel()}),
				e(Button, {label: "OK", handler: () => this.promise.resolve(this.newName.value)})
			)
		);
	}
}


class File extends Component.withWatchables("file") {
	bdElements(){
		return e("tr",
			e("td", {bdReflect: ["file", file => file.name]}),
			e("td", {bdReflect: ["file", file => formatTimestamp(file.modified)]}),
			e("td", {bdReflect: ["file", file => file.size]}),
			e("td", e(Button, {label: "rename", handler: this.rename.bind(this)}))
		);
	}

	rename(){
		RenameDialog.show({currentName: this.file.name}).then(
			result => result && (this.file.name = result)
		);
	}
}

export default class FileList extends Component {
	bdElements(){
		return e("table", {className: "list"},
			e("tr",
				e("th", "Name"),
				e("th", "Modified"),
				e("th", "Size"),
				e("th", "Rename")
			),
			this.kwargs.files.map(file => e(File, {file: file})));
	}
}

