import {Component, render, e, stopEvent} from "./backdraft.js";

class ProductRow extends Component {
	bdElements(){
		let product = this.kwargs.product;
		return e("tr", {className: !product.stocked && "not-stocked"},
			e("td", product.name),
			e("td", product.price),
		);
	}

	parentOnMutate(parent){
		parent.watch("filterText", filterText => {
			if(filterText && this.kwargs.product.name.indexOf(filterText) === -1){
				this.addClassName("hide");
			}else{
				this.removeClassName("hide");
			}
		});
	}
}

class ProductTable extends Component.withWatchables("filterText", "inStockOnly") {
	bdElements(){
		let currentCategory = null;
		let categoryRow = category =>
			(category !== currentCategory) &&
			e("tr", e("th", {colSpan: 2}, (currentCategory = category)));

		return e("table",
			e("thead",
				e("tr", e("th", "Name"), e("th", "Price")),
			),
			e("tbody",
				this.kwargs.products.map(product => [
					categoryRow(product.category),
					e(ProductRow, {product: product})
				])
			)
		);
	}
}

class SearchBar extends Component.withWatchables("filterText", "inStockOnly") {
	bdElements(){
		return e("form",
			e("input", {
				type: "text", placeHolder: "Search...", bdReflect: "filterText",
				bdOn_input: (e) => {
					this.bdNotify(
						{type: "search", param: "filterText", value: e.target.value}
					);
					stopEvent(e);
				}
			}),
			e("p",
				e("input", {
					type: "checkbox", bdReflect: {checked: "inStockOnly"},
					bdOn_change: (e) => {
						this.bdNotify(
							{type: "search", param: "inStockOnly", value: !!e.target.checked}
						);
						stopEvent(e);
					}
				}),
				" Only show products in stock"
			)
		);
	}
}

class FilterableProductTable extends Component.withWatchables("filterText", "inStockOnly") {
	bdElements(){
		return e("div", {bdReflectClass: ["inStockOnly", inStockOnly => inStockOnly && "in-stock-only"]},
			e(SearchBar, {
				bdOn_search: (e) => (this[e.param] = e.value),
				bdReflect: {
					filterText: "filterText", inStockOnly: "inStockOnly"
				}
			}),
			e(ProductTable, {
				products: this.kwargs.products,
				bdReflect: {filterText: "filterText", inStockOnly: "inStockOnly"}
			})
		);
	}

}

const PRODUCTS = [
	{category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
	{category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
	{category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
	{category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
	{category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
	{category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

render(
	e(FilterableProductTable, {products: PRODUCTS, filterText: "", inStockOnly: true}),
	"root"
);
