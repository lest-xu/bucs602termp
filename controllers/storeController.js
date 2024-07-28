const productDB = require('../productDB.js');
const Product = productDB.getModel();
const orderDB = require('../orderDB.js');
const Order = orderDB.getModel();

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

        res.render('displayStoreView', { title: "X Grocery Store", data: results, searchQuery });
    },

    addToCart: (req, res, next) => {
        let { productId, quantity } = req.body;
        quantity = parseInt(quantity);

        if (!req.session.cart) {
            req.session.cart = [];
        }
        let cart = req.session.cart;

        let product = cart.find(item => item.id === productId);
        if (product) {
            product.quantity += quantity;
        } else {
            cart.push({ id: productId, quantity });
        }

        res.redirect('/');
    },

    viewCart: async (req, res, next) => {
        let cart = req.session.cart || [];
        let products = await Product.find({ _id: { $in: cart.map(item => item.id) } });

        cart = cart.map(item => {
            let product = products.find(p => p._id.toString() === item.id);
            return {
                ...item,
                name: product.name,
                price: product.price,
                total: product.price * item.quantity
            };
        });

        res.render('cartView', { title: "Your Cart", cart });
    },

    checkout: async (req, res, next) => {
        let { name, address, email, phone } = req.body;
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

        // create the order
        let order = new Order({
            customerId: req.session.customerId,
            items: cart,
            date: new Date(),
            shippingInfo: { name, address, email, phone }
        });
        await order.save();

        // clear the cart
        req.session.cart = [];
        res.redirect('/orders');
    },

    viewOrders: async (req, res, next) => {
        let orders = await Order.find({ customerId: req.session.customerId });
        res.render('orderHistoryView', { title: "Order History", orders });
    },

    removeFromCart: (req, res, next) => {
        let productId = req.params.id;
        let cart = req.session.cart || [];

        req.session.cart = cart.filter(item => item.id !== productId);

        res.redirect('/cart');
    }
};
