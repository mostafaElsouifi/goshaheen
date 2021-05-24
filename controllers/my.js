const { MYProduct } = require('../models/product');
const sanitizeHtml = require('sanitize-html');
const ExpressError = require('../utils/ExpressError');

// render home page 
module.exports.renderHomePage = async(req, res)=>{
    const recommendedProducts = [];
    let products = await MYProduct.find({});

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
    res.render('home', {products, title: 'Best Products', currency: 'RM'});
}


// search product 
module.exports.search = async(req, res)=>{
    let { searchInput } = req.body;
    searchInput = sanitizeHtml(searchInput);
    searchInput = searchInput.replace('$', '_'); // to prevenet mongo injection 
    if(!searchInput) return res.redirect('/');
    const products = await MYProduct.find({$text: {$search  : searchInput}});

    if(!products.length){
        return res.render('home', {products:false,title: 'no products found'})
    }
    res.render('home', {products, title: searchInput, currency: 'RM'});
    
} 

// render product page   my/product/id
module.exports.renderProductPage = async(req,res, next)=>{
    try{
        const { id } = req.params;
        const product = await MYProduct.findById(id);
        res.render('product/show', {product, title: product.name, currency: 'RM'});
    }catch(e){
        next(new ExpressError('product not found'))
    }
}


///////////////////////////// 
///// control panel  

// render control panel page   /my/controlpanel
module.exports.renderControlPanelPage = (req, res)=>{
    res.render('controlpanel', {title: 'MY|control panel'})
}

// get all products  /my/controlpanel/allproductss
module.exports.allProducts = async(req, res)=>{
    const products = await MYProduct.find({});
    res.render('home', {products, title: 'Best Products', currency: 'RM'});
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
    const product = new MYProduct({name, category, price, images, details, video, store, affilliateLink});
    product.reviews.text = reviewTexts;
    product.reviews.images = reviewImages;
    product.rating.number = rating[0];
    product.rating.stars = rating[1];

    await product.save();
    req.flash('success', 'new product added');
    res.redirect(`/my/product/${product._id}`);
}

// render edit product form 
module.exports.renderEditForm = async(req, res)=>{
    const product = await MYProduct.findById(req.params.id);
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
    const updatedProduct = await MYProduct.findByIdAndUpdate(id, {name, category, price, images, details, video, store, affilliateLink});
    updatedProduct.reviews.images = reviewImages;
    updatedProduct.rating.number = rating[0];
    updatedProduct.rating.stars = rating[1];
    await updatedProduct.save();
    req.flash('success', 'success updated');
    res.redirect(`/my/product/${id}`);
}


// delete product
module.exports.deleteProduct = async(req, res)=>{
    const deletedProduct = await MYProduct.findByIdAndDelete(req.params.id);
    req.flash('success', `successfully deleted ${deletedProduct.name}`);
    res.redirect('/my/controlpanel')
}