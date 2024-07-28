const productDB = require('../productDB.js');
const Product = productDB.getModel();

module.exports = {
    getProducts: async (req, res, next) => {
        let products = await Product.find({});
        res.format({
            'application/json': () => res.json(products),
            'application/xml': () => res.send(productsToXML(products))
        });
    },

    getProductByName: async (req, res, next) => {
        let name = req.params.name;
        let products = await Product.find({ name: { $regex: name, $options: 'i' } });
        res.format({
            'application/json': () => res.json(products),
            'application/xml': () => res.send(productsToXML(products))
        });
    },

    getProductsByPriceRange: async (req, res, next) => {
        let min = parseFloat(req.query.min);
        let max = parseFloat(req.query.max);
        let products = await Product.find({ price: { $gte: min, $lte: max } });
        res.format({
            'application/json': () => res.json(products),
            'application/xml': () => res.send(productsToXML(products))
        });
    }
};

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