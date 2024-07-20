const productDB = require('../../productDB.js');
const Product = productDB.getModel();

module.exports = async (req, res, next) => {

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
        
        // render edit product view
        res.render('editproductView', {
            title: 'Edit an product', data: {
                id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                quantity: product.quantity
            }
        });
    });

};

