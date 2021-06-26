const { USProduct } = require('../models/product');
const { UsArticle } = require('../models/article');
const sanitizeHtml = require('sanitize-html');
const ExpressError = require('../utils/ExpressError');

// render home page 
module.exports.renderHomePage = async(req, res)=>{
    const recommendedProducts = [];
    let products = await USProduct.find({});

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
    res.render('home', {products, title: 'Best Products', currency: 'USD', article:false});
}


// search product 
module.exports.search = async(req, res)=>{
    let { searchInput } = req.body;
    searchInput = sanitizeHtml(searchInput);
    searchInput = searchInput.replace('$', '_'); // to prevenet mongo injection 
    if(!searchInput) return res.redirect('/');
    const products = await USProduct.find({$text: {$search  : searchInput}});

    if(!products.length){
        return res.render('home', {products:false,title: 'no products found'})
    }
    res.render('home', {products, title: searchInput, currency: 'USD', article:false});
    
} 

// render product page   sa/product/id
module.exports.renderProductPage = async(req,res, next)=>{
    try{
        const { id } = req.params;
        const product = await USProduct.findById(id);
        res.render('product/show', {product, title: product.name, currency: 'USD', article:false});
    }catch(e){
        next(new ExpressError('product not found'))
    }
}


///////////////////////////// 
///// control panel  

// render control panel page   /my/controlpanel
module.exports.renderControlPanelPage = (req, res)=>{
    res.render('controlpanel', {title: 'US|control panel', article:false})
}

// get all products  /sa/controlpanel/allproductss
module.exports.allProducts = async(req, res)=>{
    const products = await USProduct.find({});
    res.render('home', {products, title: 'Best Products', currency: 'USD', article:false});
}


// render add product form 
module.exports.renderAddProductForm = (req, res)=>{
    res.render('controlpanel/addproduct', {title: 'add new Product', article: false})
}

// add new product  
module.exports.addNewProduct = async(req, res)=>{
    let {name, category, price, images, rating , video, store, affilliateLink, details, reviewImages, reviewTexts} = req.body;
    details = details.split('\n');
    images = images.filter(img => img !== '');
    reviewImages = reviewImages.filter(img => img !== '');
    reviewTexts = reviewTexts.split('\n');
    price = +price;
    const product = new USProduct({name, category, price, images, details, video, store, affilliateLink});
    product.reviews.text = reviewTexts;
    product.reviews.images = reviewImages;
    product.rating.number = rating[0];
    product.rating.stars = rating[1];

    await product.save();
    req.flash('success', 'new product added');
    res.redirect(`/us/product/${product._id}`);
}

// render edit product form 
module.exports.renderEditForm = async(req, res)=>{
    const product = await USProduct.findById(req.params.id);
    res.render('controlpanel/editproduct', { product , title: `Edit ${product.name}`, article:false});
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
    const updatedProduct = await USProduct.findByIdAndUpdate(id, {name, category, price, images, details, video, store, affilliateLink});
    updatedProduct.reviews.images = reviewImages;
    updatedProduct.reviews.text = reviewTexts;
    updatedProduct.rating.number = rating[0];
    updatedProduct.rating.stars = rating[1];
    await updatedProduct.save();
    req.flash('success', 'success updated');
    res.redirect(`/us/product/${id}`);
}


// delete product
module.exports.deleteProduct = async(req, res)=>{
    const deletedProduct = await USProduct.findByIdAndDelete(req.params.id);
    req.flash('success', `successfully deleted ${deletedProduct.name}`);
    res.redirect('/us/controlpanel')
}

//////////////////////////////////////////////////
/////////////article ////////////////////

// render add new article form 
module.exports.renderAddArticle = (req, res)=>{
    res.render('controlpanel/addenarticle', {title: 'Add new Article', article:false});
}
// add article 
module.exports.addArticle = async(req, res)=>{
    const author = req.user._id;
    const { category, productLink, keywords, heading, mainImage, affilliateLink, buttonText, introduction, video } = req.body;
    const content = req.body.content;
    const newArticle = new UsArticle({ category, keywords, heading, introduction, mainImage, affilliateLink, productLink, buttonText, content, video, author});
    await newArticle.save();
    req.flash('success', `successfully added ${newArticle.heading} article`);
    res.redirect(`/us/blog/${newArticle._id}`);
}
// render edit article form 
module.exports.renderEditArticleForm = async(req, res)=>{
    const id = req.params.id;
    const article = await UsArticle.findById(id);
    res.render('controlpanel/editenarticle', {article, title: 'Edit Article'})
};

// update article 
module.exports.editArticle = async(req, res)=>{
    const id = req.params.id;
    const { category, productLink, keywords, heading, mainImage, affilliateLink, buttonText, introduction, video } = req.body;
    const content = req.body.content;
    const updatedArticle = await UsArticle.findByIdAndUpdate(id, { category, productLink, heading, mainImage, affilliateLink, keywords, buttonText, introduction, content, video });
    await updatedArticle.save();
    req.flash('success', `successfully updated ${updatedArticle.heading} article`);
    res.redirect(`/us/blog/${id}`);
}

// delete article 
module.exports.deleteArticle = async(req, res)=>{
    const id = req.params.id; 
    const deletedArticle = await UsArticle.findByIdAndDelete(id);
    req.flash('success', `successfully deleted ${deletedArticle.heading} article`);
    res.redirect('/us/blog');
}
///////////////////////////////////
///////////////// BLOG ///////////////

// render blog page 
module.exports.renderBlogPage = async(req, res)=>{
    const allArticles = await UsArticle.find();
    res.render('enblog/index', {allArticles, title: 'Blog', article:false});
}

// render show post 
module.exports.renderPostPage = async(req, res)=>{
    const id = req.params.id;
    const article = await UsArticle.findById(id);
    res.render('enblog/post', {article, title: `${article.heading}`});
}