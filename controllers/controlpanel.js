const Product = require('../models/product');
const { scrapeOne } = require('../scrapingscripts/lazadaone');

//control panel 
module.exports.renderControlPanelPage = (req, res)=>{
    res.render('controlpanel', {title: 'control panel'})
}

// show all products 

module.exports.showAllProducts = async(req, res)=>{
    const products = await Product.find({})
    res.render('home', {products, title: 'Best Products'});
}


// render add product form 
module.exports.renderAddProductForm = (req, res)=>{
    res.render('controlpanel/addproduct', {title: 'add new Product'})
}


// // add new product to the database
module.exports.addNewProduct = async(req, res)=>{
    let {name, category, price, images, rating , video, store, affilliateLink, details, reviewImages, reviewTexts} = req.body;
    details = details.split('\n');
    images = images.filter(img => img !== '');
    reviewImages = reviewImages.filter(img => img !== '');
    reviewTexts = reviewTexts.split('\n');
    price = +price;
    const product = new Product({name, category, price, images, details, video, store, affilliateLink});
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
    const product = await Product.findById(req.params.id);
    res.render('controlpanel/editproduct', { product , title: `Edit ${product.name}` });
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
    const updatedProduct = await Product.findByIdAndUpdate(id, {name, category, price, images, details, video, store, affilliateLink});
    updatedProduct.reviews.text = reviewTexts;
    updatedProduct.reviews.images = reviewImages;
    updatedProduct.rating.number = rating[0];
    updatedProduct.rating.stars = rating[1];
    await updatedProduct.save();
    req.flash('success', 'success updated');
    res.redirect(`/product/${id}`);
}



// delete product
module.exports.deleteProduct = async(req, res)=>{
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    req.flash('success', `successfully deleted ${deletedProduct.name}`);
    res.redirect('/controlpanel')
}

// scrape 
module.exports.renderScrapingOneForm = (req, res)=>{
    res.render('controlpanel/scrape/one', {title: 'scrape one product fro lazda'});
}

module.exports.scrapeOne = async(req, res)=>{
    const { url, affilliateLink} = req.body;
    let data;
    let scrapingDone = false;
    while(!scrapingDone){
        try{
             data = await scrapeOne(url);
             data.affilliateLink = affilliateLink;
             data.store = 'lazada';
            scrapingDone = true;
        }catch(e){
            scrapingDone = false;
            console.log(e)
        }
    }
    const product = new Product(data);
    await product.save();
    res.redirect(`/product/${product._id}`);
}