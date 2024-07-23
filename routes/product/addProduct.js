module.exports = (req, res, next) => {
	// direct to add product page
	res.render('./product/addProductView', {title: 'Add a Product'});
};
