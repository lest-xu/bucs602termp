const productDB = require('../../productDB.js');
const Product = productDB.getModel();

module.exports = (req, res, next) => {

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

        // direct to view the product details page
        res.render('./product/viewProductDetails', {
            title: 'View a product details', data: {
                id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                quantity: product.quantity,
                imgUrl: product.imgUrl
            }
        });
    });

};
