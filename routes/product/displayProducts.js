const productDB = require('../../productDB.js');
const Product = productDB.getModel();

// display products

module.exports = async (req, res, next) => {

    // find all products from productDB
    let products = await Product.find({});

    let results = products.map(item => {
        return {
            id: item._id,
            name: item.name,
            price: item.price,
            description: item.description,
            quantity: item.quantity,
            imgUrl: item.imgUrl
        }
    });

    res.render('./product/displayProductsView',
        { title: "List of Products", data: results });

};
