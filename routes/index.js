var express = require('express');
var router = express.Router();

// other modules
var displayproducts = require("./displayproducts");
var addProduct = require("./addProduct");
var saveProduct = require("./saveProduct");
var editProduct = require("./editProduct");
var saveAfterEdit = require("./saveAfterEdit");
var deleteProduct = require("./deleteProduct");
var deleteProductAfterConfirm = require("./deleteProductAfterConfirm");

/// order routes

/// customer routes


/// product routes
// router specs
router.get('/', function (req, res, next) {
  res.redirect('/products');
});

router.get('/products', displayproducts);

router.get('/products/add', addProduct);
router.post('/products/add', saveProduct);

router.get('/products/edit/:id', editProduct);
router.post('/products/edit/', saveAfterEdit);

router.get('/products/delete/:id', deleteProduct);
router.post('/products/delete', deleteProductAfterConfirm);

module.exports = router;
