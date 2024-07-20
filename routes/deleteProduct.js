const productDB = require('../productDB.js');
const Product = productDB.getModel();

module.exports = async (req, res, next) => {

	// Fill in the code
	// get product id from params on edit view 
	let id = req.params.id;

	// find the product by id
	Product.findById(id, (error, product) => {
		if (error) {
			console.log(`Edit Error: ${error}`);
		}
		// make sure found the product
		if (!product) {
			return res.render('404');
		}

		// render to delete product view
		res.render('deleteProductView', {title: 'Confirm deleting product',data: {
			id: id,
			firstName: product.firstName,
			lastName: product.lastName
		}});
		
	});

};

