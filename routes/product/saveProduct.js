const productDB = require('../../productDB.js');
const Product = productDB.getModel();

module.exports = async (req, res, next) => {

	// define the product model object from productDB
	let product = product({
		name: req.body.name, // assign the value from input
		price: req.body.price,
		description: req.body.description,
		quantity: req.body.quantity
	});

	// save the product and redirect to products' home page
	Product.save((error) => {
		if (error) {
			console.log(`Save Error: ${error}`);
		}
		res.redirect('/products');
	});

};
