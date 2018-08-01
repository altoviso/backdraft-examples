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
		let name = product.stocked ? product.name : e("span", {style: {color: "red"}}, product.name);
		return e("tr",
			e("td", name),
			e("td", product.price),
		);
	}

	filter(filterText, inStockOnly){
		let product = this.kwargs.product;
		this.visible = (!filterText || product.name.indexOf(filterText) !== -1) && (!inStockOnly || product.stocked);
	}
}

class ProductTable extends Component {
	_elements(){
		const rows = [];
		let lastCategory = null;

		this.kwargs.products.forEach((product) =>{
			if(product.category !== lastCategory){
				rows.push(e(ProductCategoryRow, {category: product.category}));
			}
			rows.push(e(ProductRow, {product: product}));
			lastCategory = product.category;
		});

		return e("table",
			e("thead",
				e("tr",
					e("th", "Name"),
					e("th", "Price")
				),
			),
			e("tbody", rows)
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
			e("input", {type: "text", placeHolder: "Search...", [e.attach]: "_filterText"}),
			e("p",
				e("input", {type: "checkbox", [e.attach]: "_inStockOnly"}), " Only show products in stock"
			)
		);
	}
}

class FilterableProductTable extends Component {
	_updateFilters(filterText, inStockOnly){
		this.filterBar.filterText = filterText;
		this.filterBar.inStockOnly = inStockOnly;
		this.productTable.filter(filterText, inStockOnly);
	}

	constructor(props){
		super(props);
	}

	_elements(){
		return e("div",
			e(SearchBar, {[e.attach]: "filterBar"}),
			e(ProductTable, {products: this.kwargs.products, [e.attach]: "productTable"})
		);
	}

	postRender(){
		this._updateFilters(this.kwargs.filterText, this.kwargs.inStockOnly);
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
