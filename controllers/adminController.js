const productDB = require('../productDB.js');
const Product = productDB.getModel();
const orderDB = require('../orderDB.js');
const Order = orderDB.getModel();
const customerDB = require('../customerDB.js');
const Customer = customerDB.getModel();

module.exports = {

    // GET show admin home page
    displayAdmin: async (req, res, next) => {
        // find all products from productDB
        let products = await Product.find({});

        let customers = await Customer.find({});

        let productResults = products.map(item => ({
            id: item._id,
            name: item.name,
            price: item.price,
            description: item.description,
            quantity: item.quantity,
            imgUrl: item.imgUrl
        }));

        let customerResults = customers.map(customer => ({
            id: customer._id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone
        }));

        res.render('./displayAdminView', {
            title: "Admin - X Grocery Store",
            data: productResults,
            customers: customerResults
        });

    },

    // GET show customer details page
    viewCustomerDetails: async (req, res, next) => {
        // get customer id from params on edit view 
        let id = req.params.id;

        // find the customer by id
        let customer = await Customer.findById(id);
        
        // make sure found the customer
        if (!customer) {
            return res.render('404');
        }

        // find the orders by customer id
        orders = await Order.find({ customerId: customer.id });

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

        res.render('./customer/viewCustomerDetails', {
            title: "View Customer Details",
            customer: {
                id: customer._id,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phone: customer.phone
            },
            orders: orderResults
        });
    },
    
    /****** Product Management Section ******/
    // GET Add Product
    addProduct: async (req, res, next) => {
        // direct to add product page
        res.render('./product/addProductView', { title: 'Add a Product' });
    },

    // POST Save Product
    saveProduct: async (req, res, next) => {
        // define the product model object from productDB
        let product = Product({
            name: req.body.name, // assign the value from input
            price: req.body.price,
            description: req.body.description,
            quantity: req.body.quantity,
            imgUrl: req.body.imgUrl
        });

        // save the product and redirect to admin page
        product.save((error) => {
            if (error) {
                console.log(`Save Error: ${error}`);
            }
            res.redirect('/admin');
        });

    },

    // GET Edit Product
    editProduct: async (req, res, next) => {
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
            res.render('./product/editproductView', {
                title: 'Edit an product', data: {
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

    // POST Edit Product
    saveProductAfterEdit: async (req, res, next) => {
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
            product.imgUrl = req.body.imgUrl;
            // save and redirect
            product.save((error) => {
                if (error) {
                    console.log(`Save Error: ${error}`);
                }
                res.redirect('/admin');
            });

        });

    },

    // GET Delete Product
    deleteProduct: async (req, res, next) => {
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

            // render to delete product view
            res.render('./product/deleteProductView', {
                title: 'Confirm deleting product', data: {
                    id: id,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    quantity: product.quantity,
                    imgUrl: product.imgUrl
                }
            });

        });

    },

    // POST Delete Product
    deleteProductAfterConfirm: async (req, res, next) => {

        // get product id from body on edit view 
        let id = req.body.id;

        // find the product by id
        Product.findById(id, (error, product) => {
            if (error) {
                console.log(`Edit Error: ${error}`);
            }
            // make sure found the product
            if (!product) {
                return res.render('404');
            }

            // remove the product
            product.remove((error) => {
                if (error) {
                    console.log(`Delete product Error: ${error}`);
                }

                // redirect to admin page
                res.redirect('/admin');

            });
        });

    },

    /****** Orders Management Section ******/
    updateOrder: async (req, res) => {
        // get orderId and itemId from params
        const { orderId, itemId } = req.params;
        // get udpated quantity of the item from the input
        const { quantity } = req.body;
        
        try {
            // get the order by order id
            const order = await Order.findById(orderId);
            if (order) {
                // find the product from the order
                const product = order.products.find(product => product.id.toString() === itemId);

                if (product) {
                    product.quantity = quantity;
                    await order.save();
                }
            }
            res.redirect(`/admin/customers/${order.customerId}`);
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    },

    deleteOrder: async (req, res) => {
        const { orderId } = req.params;
    
        try {
            const order = await Order.findByIdAndDelete(orderId);
            res.redirect(`/admin/customers/${order.customerId}`);
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
};
