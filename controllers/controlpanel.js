const { MYProduct, SAProduct } = require('../models/product');
const  getCountry  = require('../utils/getCountry');
//control panel 
module.exports.renderControlPanelPage = (req, res)=>{
    res.render('controlpanel', {title: 'control panel'})
}

// show all products 

module.exports.showAllProducts = async(req, res)=>{
    let products;
    const country = await getCountry();
    if(country === 'Malaysia') products = await MYProduct.find({});
    if(country === 'Saudi Arabia') products = await SAProduct.find({});
    res.render('home', {products, title: 'Best Products'});
}


// render add product form 
module.exports.renderAddProductForm = (req, res)=>{
    res.render('controlpanel/addproduct', {title: 'add new Product'})
}


// // add new product to the database
module.exports.addNewProduct = async(req, res)=>{
    let product;
    const country = await getCountry();
    let {name, category, price, images, rating , video, store, affilliateLink, details, reviewImages, reviewTexts} = req.body;
    details = details.split('\n');
    images = images.filter(img => img !== '');
    reviewImages = reviewImages.filter(img => img !== '');
    reviewTexts = reviewTexts.split('\n');
    price = +price;
    if(country === 'Malaysia') product = new MYProduct({name, category, price, images, details, video, store, affilliateLink});
    if(country === 'Saudi Arabia') new SAProduct({name, category, price, images, details, video, store, affilliateLink});
    product.reviews.text = reviewTexts;
    product.reviews.images = reviewImages;
    product.rating.number = rating[0];
    product.rating.stars = rating[1];

    await product.save();
    req.flash('success', 'new product added');
    res.redirect(`/product/${product._id}`);
}


// render edit product form  
module.exports.renderEditForm = async(req, res)=>{
    let product;
    const country = await getCountry();
    if(country === 'Malaysia') product = await MYProduct.findById(req.params.id);
    if(country === 'Saudi Arabia') product = await SAProduct.findById(req.params.id);
    res.render('controlpanel/editproduct', { product , title: `Edit ${product.name}` });
}

// update product 
module.exports.updateProduct = async(req, res) => {
    let updatedProduct;
    const country = await getCountry();
    const  id  = req.params.id;
    let {name, category, price, images, rating , video, store, affilliateLink, details, reviewImages, reviewTexts} = req.body;
    details = details.split('\n');
    images = images.filter(img => img !== '');
    reviewImages = reviewImages.filter(img => img !== '');
    reviewTexts = reviewTexts.split('\n');
    price = +price;
    if(country === 'Malaysia') updatedProduct = await MYProduct.findByIdAndUpdate(id, {name, category, price, images, details, video, store, affilliateLink});
    if(country === 'Saudi Arabia') updatedProduct = await SAProduct.findByIdAndUpdate(id, {name, category, price, images, details, video, store, affilliateLink});
    updatedProduct.reviews.images = reviewImages;
    updatedProduct.rating.number = rating[0];
    updatedProduct.rating.stars = rating[1];
    await updatedProduct.save();
    req.flash('success', 'success updated');
    res.redirect(`/product/${id}`);
}



// delete product
module.exports.deleteProduct = async(req, res)=>{
    let deletedProduct;
    const country = await getCountry();
    if(country === 'Malaysia') deletedProduct = await MYProduct.findByIdAndDelete(req.params.id);
    if(country === 'Saudi Arabia') deletedProduct = await SAProduct.findByIdAndDelete(req.params.id);
    req.flash('success', `successfully deleted ${deletedProduct.name}`);
    res.redirect('/controlpanel')
}
