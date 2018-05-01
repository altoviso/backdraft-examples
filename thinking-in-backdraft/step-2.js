import {Component, render, e} from "./backdraft.js"

class ProductCategoryRow extends Component {
	get elements(){
		return e("tr",
			e("th", {colSpan: 2}, this.kwargs.category)
		);
	}
}

class ProductRow extends Component {
	get elements(){
		let product = this.kwargs.product;
		let name = product.stocked ? product.name : e("span", {style: {color: "red"}}, product.name);
		return e("tr",
			e("td", name),
			e("td", product.price),
		);
	}
}

class ProductTable extends Component {
	get elements(){
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
}

class SearchBar extends Component {
	get elements(){
		return e("form",
			e("input", {type: "text", placeHolder: "Search..."}),
			e("p",
				e("input", {type: "checkbox"}), " Only show products in stock"
			)
		);
	}
}

class FilterableProductTable extends Component {
	get elements(){
		return e("div",
			e(SearchBar),
			e(ProductTable, {products: this.kwargs.products})
		);
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
	e(FilterableProductTable, {products: PRODUCTS}),
	document.getElementById('root')
);
