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

        let orders = await Order.find({});

        console.log(orders);

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

        let orderResults = orders.map(order => ({
            id: order._id,
            customerId: order.customerId,
            date: order.date,
            products: order.products
        }));

        res.render('./product/displayProductsView', {
            title: "Admin - X Grocery Store",
            data: productResults,
            customers: customerResults,
            orders: orderResults
        });

    },

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
            res.render('./product/deleteProductView', {title: 'Confirm deleting product',data: {
                id: id,
                name: product.name,
                price: product.price,
                description: product.description,
                quantity: product.quantity,
                imgUrl: product.imgUrl
            }});
            
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

    displayCustomers: async (req, res, next) => {
        let customers = await Customer.find({});
        res.render('customerListView', { title: "Customers - X Grocery Store", customers });
    },

    viewCustomerOrders: async (req, res, next) => {
        let orders = await Order.find({ customerId: req.params.id });
        res.render('customerOrderHistoryView', { title: "Customer Orders - X Grocery Store", orders });
    },

    updateOrder: async (req, res, next) => {
        let { items } = req.body;
        await Order.findByIdAndUpdate(req.params.id, { items });
        res.redirect('/admin/customers');
    },

    deleteOrder: async (req, res, next) => {
        await Order.findByIdAndDelete(req.params.id);
        res.redirect('/admin/customers');
    }
};
