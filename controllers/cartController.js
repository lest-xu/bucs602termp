const productDB = require('../productDB.js');
const Product = productDB.getModel();
const orderDB = require('../orderDB.js');
const Order = orderDB.getModel();
const customerDB = require('../customerDB.js');
const Customer = customerDB.getModel();
const handlebars = require('handlebars');

module.exports = {

    // POST add items to cart
    addToCart: (req, res, next) => {
        // get productId and quantity from the input
        let { productId, quantity } = req.body;
        // convert quantity to integer
        quantity = parseInt(quantity);
        // create an empty cart in the session if the cart does not exist
        if (req.session && !req.session.cart) {
            req.session.cart = [];
        }
        // define the empty cart
        let cart = [];

        // check if there are items in the session cart 
        if (req.session && req.session.cart) {
            cart = req.session.cart
        }

        // find the product by id from the cart
        let product = cart.find(item => item.id === productId);
        if (product) {
            // update the quantity if the item already in the cart
            product.quantity += quantity;
        } else {
            // add the item to the cart if does not exist in the cart
            cart.push({ id: productId, quantity });
        }

        res.redirect('/');
    },

    // GET view items in the cart view page
    viewCart: async (req, res, next) => {
        // define the empty cart
        let cart = [];
        // check the items in the session cart
        if (req.session && req.session.cart) {
            // get cart object from the session cart
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

// helper - format the currency
handlebars.registerHelper('formatCurrency', function (value) {
    return parseFloat(value).toFixed(2);
});

// helper - format the date
handlebars.registerHelper('formatDate', function (dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString(undefined, options);
});