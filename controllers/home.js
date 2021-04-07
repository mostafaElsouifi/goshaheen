const Product = require('../models/product');
module.exports.getRecommendedProducts = async(req, res)=>{
    const recommendedProducts = [];
    let products = await Product.find({})
    if(products){
        products = products.filter(p => p.rating.stars > 3);
        for(let i = 0; i < 40; i++){
            const random = Math.floor(Math.random() * products.length);
            recommendedProducts.push(products[random]);
        }
    }
    
    if(recommendedProducts.length > 0) {
        products = recommendedProducts;
    }else{
        products = false;
    }
    res.render('home', {products, title: 'Best Products'});
}