const Product = require('../models/product');
const ExpressError = require('../utils/ExpressError');

// show product
module.exports.renderProductPage = async(req,res, next)=>{
    try{
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('product/show', {product, title: product.name});
    }catch(e){
        next(new ExpressError('product not found'))
    }
}










