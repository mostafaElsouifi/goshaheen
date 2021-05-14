const { MYProduct, SAProduct } = require('../models/product');
const  getCountry  = require('../utils/getCountry');
const ExpressError = require('../utils/ExpressError');

// show product
module.exports.renderProductPage = async(req,res, next)=>{
    try{
        let product;
        const country = await getCountry();
        const { id } = req.params;
        if(country === 'Malaysia') product = await MYProduct.findById(id);
        if(country === 'Saudi Arabia') product = await SAProduct.findById(id);
        res.render('product/show', {product, title: product.name});
    }catch(e){
        next(new ExpressError('product not found'))
    }
}










