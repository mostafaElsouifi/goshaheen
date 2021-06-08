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

// articel 
router.route('/controlpanel/blog/addarticle')
      .get(isLoggedIn, my.renderAddArticle)
      .post(isLoggedIn, catchAsync(my.addArticle));

// render edit article form  and update 
router.route('/controlpanel/blog/:id/edit')
      .get(catchAsync(my.renderEditArticleForm))
      .post(catchAsync(my.editArticle));
// delete article 
router.delete('/controlpanel/blog/:id', catchAsync(my.deleteArticle))


// blog
router.get('/blog', catchAsync(my.renderBlogPage));
router.route('/blog/:id')
      .get(catchAsync(my.renderPostPage))

      
module.exports = router;
