const ExpressError = require('../utils/ExpressError');

module.exports.getRecommendedProducts = async(req, res, next)=>{
    // const recommendedProducts = [];
    // let products = await MYProduct.find({});

    // //let products = await product.find({});
    // if(products){
    //     products = products.filter(p => p.rating.stars > 3);
    //     for(let i = 0; i < 40; i++){
    //         const random = Math.floor(Math.random() * products.length);
    //         if(!recommendedProducts.includes(products[random])){
    //         recommendedProducts.push(products[random]);
    //     }
    // }
    // }
    
    // if(recommendedProducts.length > 0) {
    //     products = recommendedProducts;
    // }else{
    //     products = false;
    // }
    // if(products.includes(null)) products = false;
    next(new ExpressError('No Products For Your Country'));
    // res.render('home', {products, title: 'Best Products'});
    
}