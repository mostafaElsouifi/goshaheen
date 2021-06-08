const { SAProduct } = require('../models/product');
const { SaArticle } = require('../models/article');
const sanitizeHtml = require('sanitize-html');
const ExpressError = require('../utils/ExpressError');

// render home page 
module.exports.renderHomePage = async(req, res)=>{
    const recommendedProducts = [];
    let products = await SAProduct.find({});

    if(products){
        products = products.filter(p => p.rating.stars > 3);
        for(let i = 0; i < 40; i++){
            const random = Math.floor(Math.random() * products.length);
            if(!recommendedProducts.includes(products[random])){
            recommendedProducts.push(products[random]);
        }
    }
    }
    
    if(recommendedProducts.length > 0) {
        products = recommendedProducts;
    }else{
        products = false;
    }
    if(products.includes(null)) products = false;
    res.render('arhome', {products, title: 'تصفح أفضل العروض في السعوديه', currency: 'ريال', article:false});
}


// search product 
module.exports.search = async(req, res)=>{
    let { searchInput } = req.body;
    searchInput = sanitizeHtml(searchInput);
    searchInput = searchInput.replace('$', '_'); // to prevenet mongo injection 
    if(!searchInput) return res.redirect('/');
    const products = await SAProduct.find({$text: {$search  : searchInput}});

    if(!products.length){
        return res.render('home', {products:false,title: 'no products found'})
    }
    res.render('arhome', {products, title: searchInput, currency: 'ريال', article:false});
    
} 

// render product page   sa/product/id
module.exports.renderProductPage = async(req,res, next)=>{
    try{
        const { id } = req.params;
        const product = await SAProduct.findById(id);
        res.render('product/arshow', {product, title: product.name, currency: 'ريال'});
    }catch(e){
        next(new ExpressError('product not found'))
    }
}


///////////////////////////// 
///// control panel  

// render control panel page   /my/controlpanel
module.exports.renderControlPanelPage = (req, res)=>{
    res.render('controlpanel', {title: 'SA|control panel'})
}

// get all products  /sa/controlpanel/allproductss
module.exports.allProducts = async(req, res)=>{
    const products = await SAProduct.find({});
    res.render('home', {products, title: 'Best Products', currency: 'ريال'});
}


// render add product form 
module.exports.renderAddProductForm = (req, res)=>{
    res.render('controlpanel/addproduct', {title: 'add new Product'})
}

// add new product  
module.exports.addNewProduct = async(req, res)=>{
    let {name, category, price, images, rating , video, store, affilliateLink, details, reviewImages, reviewTexts} = req.body;
    details = details.split('\n');
    images = images.filter(img => img !== '');
    reviewImages = reviewImages.filter(img => img !== '');
    reviewTexts = reviewTexts.split('\n');
    price = +price;
    const product = new SAProduct({name, category, price, images, details, video, store, affilliateLink});
    product.reviews.text = reviewTexts;
    product.reviews.images = reviewImages;
    product.rating.number = rating[0];
    product.rating.stars = rating[1];

    await product.save();
    req.flash('success', 'new product added');
    res.redirect(`/sa/product/${product._id}`);
}

// render edit product form 
module.exports.renderEditForm = async(req, res)=>{
    const product = await SAProduct.findById(req.params.id);
    res.render('controlpanel/editproduct', { product , title: `Edit ${product.name}`});
}

// update product 
module.exports.updateProduct = async(req, res) => {
    const  id  = req.params.id;
    let {name, category, price, images, rating , video, store, affilliateLink, details, reviewImages, reviewTexts} = req.body;
    details = details.split('\n');
    images = images.filter(img => img !== '');
    reviewImages = reviewImages.filter(img => img !== '');
    reviewTexts = reviewTexts.split('\n');
    price = +price;
    const updatedProduct = await SAProduct.findByIdAndUpdate(id, {name, category, price, images, details, video, store, affilliateLink});
    updatedProduct.reviews.images = reviewImages;
    updatedProduct.rating.number = rating[0];
    updatedProduct.rating.stars = rating[1];
    await updatedProduct.save();
    req.flash('success', 'success updated');
    res.redirect(`/sa/product/${id}`);
}


// delete product
module.exports.deleteProduct = async(req, res)=>{
    const deletedProduct = await SAProduct.findByIdAndDelete(req.params.id);
    req.flash('success', `successfully deleted ${deletedProduct.name}`);
    res.redirect('/sa/controlpanel')
}
//////////////////////////////////////////////////
/////////////article ////////////////////

// render add new article form 
module.exports.renderAddArticle = (req, res)=>{
    res.render('controlpanel/addararticle', {title: 'كتابه مقال جديد', article:false});
}
// add article 
module.exports.addArticle = async(req, res)=>{
    const author = req.user._id;
    const { heading, mainImage, affilliateLink, buttonText, mainContent, video } = req.body;
    const article = req.body.content;
    const newArticle = new SaArticle({ heading, mainContent, mainImage, affilliateLink, buttonText, article, video, author});
    await newArticle.save();
    req.flash('success', `successfully added ${newArticle.heading} article`);
    res.redirect(`/sa/blog/${newArticle._id}`);
}
// render edit article form 
module.exports.renderEditArticleForm = async(req, res)=>{
    const id = req.params.id;
    const article = await SaArticle.findById(id);
    res.render('controlpanel/editararticle', {article, title: 'تعديل المقال'})
};

// update article 
module.exports.editArticle = async(req, res)=>{
    const id = req.params.id;
    const { heading, mainImage, affilliateLink, buttonText, mainContent, video } = req.body;
    const article = req.body.content;
    const updatedArticle = await SaArticle.findByIdAndUpdate(id, { heading, mainImage, affilliateLink, buttonText, mainContent, article, video });
    await updatedArticle.save();
    req.flash('success', `successfully updated ${updatedArticle.heading} article`);
    res.redirect(`/sa/blog/${id}`);
}

// delete article 
module.exports.deleteArticle = async(req, res)=>{
    const id = req.params.id; 
    const deletedArticle = await SaArticle.findByIdAndDelete(id);
    req.flash('success', `successfully deleted ${deletedArticle.heading} article`);
    res.redirect('/sa/blog');
}
///////////////////////////////////
///////////////// BLOG ///////////////

// render blog page 
module.exports.renderBlogPage = async(req, res)=>{
    const allArticles = await SaArticle.find();
    res.render('arblog/index', {allArticles, title: 'المقالات', article:false});
}

// render show post 
module.exports.renderPostPage = async(req, res)=>{
    const id = req.params.id;
    const article = await SaArticle.findById(id);
    res.render('arblog/post', {article, title: `${article.heading}`});
}