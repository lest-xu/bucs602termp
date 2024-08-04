const productDB = require('../productDB.js');
const Product = productDB.getModel();
const orderDB = require('../orderDB.js');
const Order = orderDB.getModel();
const customerDB = require('../customerDB.js');
const Customer = customerDB.getModel();

module.exports = {
    displayStore: async (req, res, next) => {
        // defind the searchQuery
        let searchQuery = req.query.search || "";
        
        // Search for products by name or description
        let products = await Product.find({
            $or: [
                { name: new RegExp(searchQuery, 'i') },
                { description: new RegExp(searchQuery, 'i') }
            ]
        });

        let results = products.map(item => {
            return {
                id: item._id,
                name: item.name,
                price: item.price,
                description: item.description,
                quantity: item.quantity,
                imgUrl: item.imgUrl
            };
        });
        // create an empty cart
        let cart = [];
        // check the cart from the sessions
        if (req.session && req.session.cart) {
            cart = req.session.cart;
            // find the products from the cart in the current session
            let products = await Product.find({ _id: { $in: cart.map(item => item.id) } });

            cart = cart.map(item => {
                let product = products.find(p => p._id.toString() === item.id);
                return {
                    ...item,
                    name: product.name,
                    price: product.price,
                    imgUrl: product.imgUrl,
                    total: product.price * item.quantity // calcualte the total price of each item
                };
            });

        }
        // calculate the total items in the cart
        let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

        res.render('displayStoreView', { title: "X Grocery Store", data: results, searchQuery, totalQuantity });
    },

    // GET show product details page when clicks the title link
    viewProductDetails: (req, res, next) => {
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

    },

    // view the customer orders
    viewOrders: async (req, res, next) => {
        // init orders and orderResults
        let orders = undefined;
        let orderResults = undefined;
        // check the custoemrId of current session
        if (req.session && req.session.customerId) {
            
            // find the order by customer id of current session
            orders = await Order.find({ customerId: req.session.customerId });

            // map the orders with Promise.all
            orderResults = await Promise.all(orders.map(async order => {
                // for each product in the order, fetch the product details
                const productsWithDetails = await Promise.all(order.products.map(async item => {
                    // find the product by id from the db
                    const product = await Product.findById(item.id);
                    // calculate total price
                    const totalPrice = item.quantity * product.price;
                    // return the product object with udpated name and price
                    return {
                        id: item.id,
                        quantity: item.quantity,
                        name: product.name,
                        price: product.price,
                        imgUrl: product.imgUrl,
                        total: totalPrice
                    };
                }));
                // return the order obejct
                return {
                    id: order._id,
                    customerId: order.customerId,
                    date: order.date,
                    products: productsWithDetails // updated Product obejct with name and price
                };
            }));

        }

        res.render('orderHistoryView', { title: "Order History", orders: orderResults });
    },

};
