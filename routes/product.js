const express = require('express');
const router = express.Router();
const product = require('../controllers/product');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');







router.route('/:id')
      .get(catchAsync(product.renderProductPage))



module.exports = router;