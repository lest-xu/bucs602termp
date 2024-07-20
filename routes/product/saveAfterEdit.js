const productDB = require('../productDB.js');
const Product = productDB.getModel();

module.exports = async (req, res, next) => {

    // get product id from body on edit view 
    let id = req.body.id;
    
    // find the product by id
    Product.findById(id, (error, product) => {
        if (error) {
            console.log(`After Edit Error: ${error}`);
        }
        // make sure found the product
        if (!product) {
            return res.render('404');
        }
        
        // update first and last name
        product.name = req.body.name;
        product.price = req.body.price;
        product.description = req.body.description;
        product.quantity = req.body.quantity;

        // save and redirect
        product.save((error) => {
            if (error) {
                console.log(`Save Error: ${error}`);
            }
            res.redirect('/products');
        });

    });

};
