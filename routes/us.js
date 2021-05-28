const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const us = require('../controllers/us');


router.get('/', catchAsync(us.renderHomePage));
router.post('/search', catchAsync(us.search));

router.get('/product/:id', catchAsync(us.renderProductPage))


// conrolpanel  
router.get('/controlpanel', isLoggedIn, us.renderControlPanelPage);
router.get('/controlpanel/allproducts', isLoggedIn, catchAsync(us.allProducts));

router.route('/controlpanel/addproduct')
      .get(isLoggedIn, us.renderAddProductForm)
      .post(isLoggedIn, catchAsync(us.addNewProduct));

router.get('/controlpanel/product/:id/edit', isLoggedIn, us.renderEditForm);

router.route('/controlpanel/product/:id')
      .delete(isLoggedIn, catchAsync(us.deleteProduct))
      .put(isLoggedIn, catchAsync(us.updateProduct));
module.exports = router;
