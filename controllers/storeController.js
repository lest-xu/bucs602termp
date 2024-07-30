const productDB = require('../productDB.js');
const Product = productDB.getModel();
const orderDB = require('../orderDB.js');
const Order = orderDB.getModel();
const customerDB = require('../customerDB.js');
const Customer = customerDB.getModel();

module.exports = {
    displayStore: async (req, res, next) => {
        let searchQuery = req.query.search || "";
        let products = await Product.find({
            name: { $regex: searchQuery, $options: 'i' }
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

        let cart = [];
        if (req.session && req.session.cart) {
            cart = req.session.cart;

            let products = await Product.find({ _id: { $in: cart.map(item => item.id) } });

            cart = cart.map(item => {
                let product = products.find(p => p._id.toString() === item.id);
                return {
                    ...item,
                    name: product.name,
                    price: product.price,
                    imgUrl: product.imgUrl,
                    total: product.price * item.quantity
                };
            });

        }
        // calculate the total items in the cart
        let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);


        res.render('displayStoreView', { title: "X Grocery Store", data: results, searchQuery, totalQuantity });
    },

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

    addToCart: (req, res, next) => {
        let { productId, quantity } = req.body;
        quantity = parseInt(quantity);

        if (req.session && !req.session.cart) {
            req.session.cart = [];
        }
        let cart = [];

        if (req.session && req.session.cart) {
            cart = req.session.cart
        }

        let product = cart.find(item => item.id === productId);
        if (product) {
            product.quantity += quantity;
        } else {
            cart.push({ id: productId, quantity });
        }

        res.redirect('/');
    },

    viewCart: async (req, res, next) => {
        let cart = [];
        if (req.session && req.session.cart) {
            cart = req.session.cart;
            // console.log('viewcart', req.session);
            let products = await Product.find({ _id: { $in: cart.map(item => item.id) } });

            cart = cart.map(item => {
                let product = products.find(p => p._id.toString() === item.id);
                return {
                    ...item,
                    name: product.name,
                    price: product.price,
                    imgUrl: product.imgUrl,
                    total: product.price * item.quantity
                };
            });

        }
        // calculate the total cost and total items in the cart
        let grandTotal = cart.reduce((sum, item) => sum + item.total, 0);
        let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

        res.render('cartView', { title: "Your Cart", cart, grandTotal, totalQuantity });
    },

    updateCart: (req, res, next) => {
        let { productId, quantity } = req.body;
        quantity = parseInt(quantity);

        if (!req.session.cart) {
            return res.redirect('/cart');
        }

        let cart = req.session.cart;
        let product = cart.find(item => item.id === productId);

        if (product) {
            product.quantity = quantity;
        }

        res.redirect('/cart');
    },

    checkout: async (req, res, next) => {
        let { firstName, lastName, email, phone } = req.body;
        console.log('req.body', req.body);
        let cart = req.session.cart || [];

        // make sure the item is available
        for (let item of cart) {
            let product = await Product.findById(item.id);
            if (product.quantity < item.quantity) {
                return res.status(400).send('Insufficient stock for ' + product.name);
            }
        }
        console.log('checkout...', cart);
        // update the stock when checkout
        for (let item of cart) {
            let product = await Product.findById(item.id);
            product.quantity -= item.quantity;
            await product.save();
        }

        // find or create customer
        let customer = await Customer.findOne({ email: email });
        if (!customer) {
            customer = new Customer({ firstName, lastName, email, phone });
            await customer.save();
        }
        // set the customerId of the session for current customer
        req.session.customerId = customer._id;
        // create the order for the current customer
        let order = new Order({
            customerId: customer._id,
            products: cart,
            date: new Date()
        });
        await order.save();

        // clear the cart
        req.session.cart = [];
        res.redirect('/orders');
    },

    // view the customer orders
    viewOrders: async (req, res, next) => {
        let orders = undefined;
        let orderResults = undefined;
        if (req.session && req.session.customerId) {
            console.log('req.session.customerId', req.session.customerId);
            orders = await Order.find({ customerId: req.session.customerId });

            // mpa the orders with Promise.all
            orderResults = await Promise.all(orders.map(async order => {
                // for each product in the order, fetch the product details
                const productsWithDetails = await Promise.all(order.products.map(async item => {
                    // find the product by id from the db
                    const product = await Product.findById(item.id);
                    // return the product object with udpated name and price
                    return {
                        id: item.id,
                        quantity: item.quantity,
                        name: product.name,
                        price: product.price,
                        imgUrl: product.imgUrl
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

            console.log('cal orders', orderResults);
        }

        res.render('orderHistoryView', { title: "Order History", orders: orderResults });
    },

    removeFromCart: (req, res, next) => {
        let { productId } = req.body;

        if (!req.session.cart) {
            return res.redirect('/cart');
        }

        let cart = req.session.cart;
        req.session.cart = cart.filter(item => item.id !== productId);

        res.redirect('/cart');
    }
};
