const productDB = require('../productDB.js');
const Product = productDB.getModel();

module.exports = {

    // GET all products
    getProducts: async (req, res, next) => {
        // find all products from db
        let products = await Product.find({});

        // return the results to the specificed jsom or xml format
        res.format({
            'application/json': () => res.json(products),
            'application/xml': () => res.send(productsToXML(products))
        });
    },

    // GET product by name
    getProductByName: async (req, res, next) => {
        // get name value from the params
        let name = req.params.name;
        // find the products by name from db
        let products = await Product.find({ name: { $regex: name, $options: 'i' } });
        // return the results to the specificed jsom or xml format
        res.format({
            'application/json': () => res.json(products),
            'application/xml': () => res.send(productsToXML(products))
        });
    },


    // GET product by price range
    getProductsByPriceRange: async (req, res, next) => {
        // define the min and max for the product price range from query url
        let min = parseFloat(req.query.min);
        let max = parseFloat(req.query.max);
        // find the products by the min and max price range
        let products = await Product.find({ price: { $gte: min, $lte: max } });

        // return the results to the specificed jsom or xml format
        res.format({
            'application/json': () => res.json(products),
            'application/xml': () => res.send(productsToXML(products))
        });
    }
};

/// HELPER Functions 
function productsToXML(products) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?><products>';
    products.forEach(product => {
        xml += `<product>
                    <id>${product._id}</id>
                    <name>${product.name}</name>
                    <price>${product.price}</price>
                    <description>${product.description}</description>
                    <quantity>${product.quantity}</quantity>
                    <imgUrl>${product.imgUrl}</imgUrl>
                </product>`;
    });
    xml += '</products>';
    return xml;
}