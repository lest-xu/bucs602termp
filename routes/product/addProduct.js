module.exports = (req, res, next) => {
	// direct to add product page
	res.render('addProductView', {title: 'Add a Product'});
};
