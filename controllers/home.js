const { MYProduct, SAProduct } = require('../models/product');
const  getCountry  = require('../utils/getCountry');

module.exports.getRecommendedProducts = async(req, res)=>{
    let products;
    const country = await getCountry();
    const recommendedProducts = [];
    if(country === 'Saudi Arabia'){
        products = await SAProduct.find({});
    }
    //let products = await product.find({});
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
    res.render('home', {products, title: 'Best Products'});
    
}