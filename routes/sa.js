const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const sa = require('../controllers/sa');


router.get('/', catchAsync(sa.renderHomePage));
router.post('/search', catchAsync(sa.search));

router.get('/product/:id', catchAsync(sa.renderProductPage))


// conrolpanel  
router.get('/controlpanel', isLoggedIn, sa.renderControlPanelPage);
router.get('/controlpanel/allproducts', isLoggedIn, catchAsync(sa.allProducts));

router.route('/controlpanel/addproduct')
      .get(isLoggedIn, sa.renderAddProductForm)
      .post(isLoggedIn, catchAsync(sa.addNewProduct));

router.get('/controlpanel/product/:id/edit', isLoggedIn, sa.renderEditForm);

router.route('/controlpanel/product/:id')
      .delete(isLoggedIn, catchAsync(sa.deleteProduct))
      .put(isLoggedIn, catchAsync(sa.updateProduct));
module.exports = router;
