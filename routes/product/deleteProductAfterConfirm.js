const productDB = require('../../productDB.js');
const Product = productDB.getModel();

module.exports = async (req, res, next) => {

	// get product id from body on edit view 
	let id = req.body.id;

	// find the product by id
	Product.findById(id, (error, product) => {
		if (error) {
			console.log(`Edit Error: ${error}`);
		}
		// make sure found the product
		if (!product) {
			return res.render('404');
		}

		// remove the product
		product.remove((error) => {
			if (error) {
				console.log(`Delete product Error: ${error}`);
			}

			// redirect to products view
			res.redirect('/products');

		});
	});

};

