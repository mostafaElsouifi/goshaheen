const { MYProduct, SAProduct } = require('../models/product');
const sanitizeHtml = require('sanitize-html');


module.exports.searchProduct = async(req, res)=>{
    let { searchInput } = req.body;
    searchInput = sanitizeHtml(searchInput);
    searchInput = searchInput.replace('$', '_'); // to prevenet mongo injection 
    if(!searchInput) return res.redirect('/');
    const products = await MYProduct.find({$text: {$search  : searchInput}});

    if(!products.length){
        return res.render('home', {products:false,title: 'no products found'})
    }
    res.render('home', {products, title: searchInput});
    
} 