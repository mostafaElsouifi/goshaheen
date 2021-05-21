const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const my = require('../controllers/my');


router.get('/', catchAsync(my.renderHomePage));
router.post('/search', catchAsync(my.search));

router.get('/product/:id', catchAsync(my.renderProductPage))

// conrolpanel  
router.get('/controlpanel', isLoggedIn, my.renderControlPanelPage);
router.get('/controlpanel/allproducts', isLoggedIn, catchAsync(my.allProducts));

router.route('/controlpanel/addproduct')
      .get(isLoggedIn, my.renderAddProductForm)
      .post(isLoggedIn, catchAsync(my.addNewProduct));

router.get('/controlpanel/product/:id/edit', isLoggedIn, my.renderEditForm);

router.route('/controlpanel/product/:id')
      .delete(isLoggedIn, catchAsync(my.deleteProduct))
      .put(isLoggedIn, catchAsync(my.updateProduct));
      
module.exports = router;
