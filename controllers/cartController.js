const productDB = require('../productDB.js');
const Product = productDB.getModel();
const orderDB = require('../orderDB.js');
const Order = orderDB.getModel();
const customerDB = require('../customerDB.js');
const Customer = customerDB.getModel();

module.exports = {

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
        
        let cart = req.session.cart || [];

        // make sure the item is available
        for (let item of cart) {
            let product = await Product.findById(item.id);
            if (product.quantity < item.quantity) {
                return res.status(400).send('Insufficient stock for ' + product.name);
            }
        }
        
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
