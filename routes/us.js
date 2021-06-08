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


// articel 
router.route('/controlpanel/blog/addarticle')
      .get(isLoggedIn, us.renderAddArticle)
      .post(isLoggedIn, catchAsync(us.addArticle));

// render edit article form  and update 
router.route('/controlpanel/blog/:id/edit')
      .get(catchAsync(us.renderEditArticleForm))
      .post(catchAsync(us.editArticle));
// delete article 
router.delete('/controlpanel/blog/:id', catchAsync(us.deleteArticle))


// blog
router.get('/blog', catchAsync(us.renderBlogPage));
router.route('/blog/:id')
      .get(catchAsync(us.renderPostPage))



module.exports = router;
