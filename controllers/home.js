const Product = require('../models/product');
module.exports.getRecommendedProducts = async(req, res)=>{
    const recommendedProducts = [];
    let products = await Product.find({})
    products = products.filter(p => p.rating.stars > 3);
    for(let i = 0; i < 40; i++){
        const random = Math.floor(Math.random() * products.length);
        recommendedProducts.push(products[random]);
    }
    res.render('home', {products: recommendedProducts, title: 'Best Products'});
}