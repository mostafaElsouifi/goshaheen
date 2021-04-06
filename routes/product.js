const express = require('express');
const router = express.Router();
const product = require('../controllers/product');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateProduct } = require('../middleware');



router.post('/', isLoggedIn, catchAsync(product.addNewProduct));

router.route('/add')
      .get(isLoggedIn, product.renderAddProductForm);

router.get('/allproducts', isLoggedIn, product.showAllProducts);


router.route('/:id')
      .get(catchAsync(product.renderProductPage))
      .delete(isLoggedIn, catchAsync(product.deleteProduct))
      .put(isLoggedIn, catchAsync(product.updateProduct));

router.get('/:id/edit', isLoggedIn, product.renderEditForm);


module.exports = router;