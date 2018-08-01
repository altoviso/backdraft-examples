import {Component, render, e, stopEvent} from "./backdraft.js"

class ProductCategoryRow extends Component {
	_elements(){
		return e("tr",
			e("th", {colSpan: 2}, this.kwargs.category)
		);
	}
}

class ProductRow extends Component {
	_elements(){
		let product = this.kwargs.product;
		return e("tr",
			e("td", product.stocked ?
				product.name :
				e("span", {style: {color: "red"}}, product.name)
			),
			e("td", product.price),
		);
	}

	filter(filterText, inStockOnly){
		let product = this.kwargs.product;
		this.visible =
			(!filterText || product.name.indexOf(filterText) !== -1) &&
			(!inStockOnly || product.stocked);
	}
}

class ProductTable extends Component {
	_elements(){
		let lastCategory = null;
		return e("table",
			e("thead",
				e("tr",
					e("th", "Name"),
					e("th", "Price")
				),
			),
			e("tbody",
				this.kwargs.products.map((product) => ([
					product.category !== lastCategory &&
					e(ProductCategoryRow, {category: (lastCategory = product.category)}),

					e(ProductRow, {product: product})
				]))
			)
		);
	}

	filter(filterText, inStockOnly){
		this.children.forEach((child) =>{
			child.filter && child.filter(filterText, inStockOnly);
		});
	}
}

class SearchBar extends Component {
	set filterText(value){
		this._filterText.value = value;
	}

	set inStockOnly(value){
		this._inStockOnly.checked = value;
	}

	_elements(){
		return e("form",
			e("input", {
				type: "text",
				placeHolder: "Search...",
				[e.attach]: "_filterText",
				[e.advise]: {
					input: (e) =>{
						this._applyHandlers(
							{name: "searchValueMutate", parameter: "searchText", value: e.target.value}
						);
						stopEvent(e);
					}
				}
			}),
			e("p",
				e("input", {
					type: "checkbox",
					[e.attach]: "_inStockOnly",
					[e.advise]: {
						change: (e) =>{
							this._applyHandlers({
								name: "searchValueMutate",
								parameter: "inStockOnly",
								value: !!e.target.checked
							});
							stopEvent(e);
						}
					}
				}),
				" Only show products in stock"
			)
		);
	}
}

class FilterableProductTable extends Component {
	constructor(props){
		super(props);
		this.searchText = props.searchText;
		this.inStockOnly = props.inStockOnly;
	}

	_elements(){
		return e("div",
			e(SearchBar, {
				[e.attach]: "searchBar",
				[e.advise]: {
					"searchValueMutate": (e) =>{
						this[e.parameter === "searchText" ? "searchText" : "inStockOnly"] = e.value;
						this._updateFilters();
					}
				}
			}),
			e(ProductTable, {products: this.kwargs.products, [e.attach]: "productTable"})
		);
	}

	postRender(){
		this._updateFilters();
	}

	_updateFilters(){
		this.searchBar.searchText = this.searchText;
		this.searchBar.inStockOnly = this.inStockOnly;
		this.productTable.filter(this.searchText, this.inStockOnly);
	}
}


const PRODUCTS = [
	{category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
	{category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
	{category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
	{category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
	{category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
	{category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

render(
	e(FilterableProductTable, {products: PRODUCTS, filterText: "", inStockOnly: true}),
	document.getElementById('root')
);
