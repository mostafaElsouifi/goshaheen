const express = require('express');
const router = express.Router();
const search = require('../controllers/search');
const catchAsync = require('../utils/catchAsync');

router.route('/')
      .post(catchAsync(search.searchProduct))







module.exports = router;