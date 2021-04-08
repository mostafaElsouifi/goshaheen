const express = require('express');
const router = express.Router();
const controlPanel = require('../controllers/controlpanel');
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');


router.get('/', isLoggedIn, controlPanel.renderControlPanelPage);

router.get('/allproducts', isLoggedIn, controlPanel.showAllProducts);

router.route('/addproduct')
      .get(isLoggedIn, controlPanel.renderAddProductForm)
      .post(isLoggedIn, catchAsync(controlPanel.addNewProduct));


router.get('/product/:id/edit', isLoggedIn, controlPanel.renderEditForm);

router.route('/product/:id')
      .put(isLoggedIn, catchAsync(controlPanel.updateProduct))
      .delete(isLoggedIn, catchAsync(controlPanel.deleteProduct))


// scraping route 
router.route('/scrapelazada/one')
      .get(isLoggedIn, controlPanel.renderScrapingOneForm)
      .post(isLoggedIn, controlPanel.scrapeOne)



module.exports = router;
