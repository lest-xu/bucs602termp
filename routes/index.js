const express = require('express');
const router = express.Router();

const storeController = require('../controllers/storeController.js');
const adminController = require('../controllers/adminController.js');
const cartController = require('../controllers/cartController.js');
const apiController = require('../controllers/apiController.js');

// store home page
router.get('/', storeController.displayStore);
router.get('/products/:id', storeController.viewProductDetails);
router.get('/orders', storeController.viewOrders);

// cart routes
router.post('/add-to-cart', cartController.addToCart);
router.get('/cart', cartController.viewCart);
router.post('/checkout', cartController.checkout);
router.post('/remove-from-cart', cartController.removeFromCart);
router.post('/update-cart', cartController.updateCart);

// admin page
router.get('/admin', adminController.displayAdmin);
// add product
router.get('/admin/products/add', adminController.addProduct);
router.post('/admin/products/add', adminController.saveProduct);
// edit product
router.get('/admin/products/edit/:id', adminController.editProduct);
router.post('/admin/products/edit/', adminController.saveProductAfterEdit);
// delete product
router.get('/admin/products/delete/:id', adminController.deleteProduct);
router.post('/admin/products/delete', adminController.deleteProductAfterConfirm);

// customer details page
router.get('/admin/customers/:id', adminController.viewCustomerDetails);
// update each order's item quantity
router.post('/admin/orders/update/:orderId/item/:itemId', adminController.updateOrder);
// delete an order
router.post('/admin/orders/delete/:orderId', adminController.deleteOrder);


// REST API
router.get('/api/products', apiController.getProducts);
router.get('/api/products/name/:name', apiController.getProductByName);
router.get('/api/products/price-range', apiController.getProductsByPriceRange);

module.exports = router;
