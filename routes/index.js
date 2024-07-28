var express = require('express');
var router = express.Router();


var displayStore = require("./displayStore");

// // order modules
// var displayOrders = require("./order/displayOrders");
// var addOrder = require("./order/addOrder");
// var saveOrder = require("./order/saveOrder");
// var editOrder = require("./order/editOrder");
// var saveOrderAfterEdit = require("./order/saveOrderAfterEdit");
// var deleteOrder = require("./order/deleteOrder");
// var deleteOrderAfterConfirm = require("./order/deleteOrderAfterConfirm");

// // customer modules
// var displayCustomers = require("./customer/displayCustomers");
// var addCustomer = require("./customer/addCustomer");
// var saveCustomer = require("./customer/saveCustomer");
// var editCustomer = require("./customer/editCustomer");
// var saveCustomerAfterEdit = require("./customer/saveCustomerAfterEdit");
// var deleteCustomer = require("./customer/deleteCustomer");
// var deleteCustomerAfterConfirm = require("./customer/deleteCustomerAfterConfirm");

// product modules
var displayProducts = require("./product/displayProducts");
var addProduct = require("./product/addProduct");
var saveProduct = require("./product/saveProduct");
var editProduct = require("./product/editProduct");
var saveProductAfterEdit = require("./product/saveProductAfterEdit");
var deleteProduct = require("./product/deleteProduct");
var deleteProductAfterConfirm = require("./product/deleteProductAfterConfirm");
var viewProductDetails = require("./product/viewProductDetails");

// shopping cart home page
router.get('/', displayStore);

// order routes

// customer routes


// product routes
router.get('/products', displayProducts);
router.get('/products/:id', viewProductDetails);
router.get('/products/add', addProduct);
router.post('/products/add', saveProduct);
router.get('/products/edit/:id', editProduct);
router.post('/products/edit/', saveProductAfterEdit);
router.get('/products/delete/:id', deleteProduct);
router.post('/products/delete', deleteProductAfterConfirm);

module.exports = router;
