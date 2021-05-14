const { MYProduct, SAProduct } = require('../models/product');
const  getCountry  = require('../utils/getCountry');
const sanitizeHtml = require('sanitize-html');


module.exports.searchProduct = async(req, res)=>{
    let products;
    const country = await getCountry();
    let { searchInput } = req.body;
    searchInput = sanitizeHtml(searchInput);
    searchInput = searchInput.replace('$', '_'); // to prevenet mongo injection 
    if(!searchInput) return res.redirect('/');
    if(country === 'Malaysia') products = await MYProduct.find({$text: {$search  : searchInput}});
    if(country === 'Saudi Arabia') products = await SAProduct.find({$text: {$search  : searchInput}});
    if(!products.length){
        return res.render('home', {products:false,title: 'no products found'})
    }
    res.render('home', {products, title: searchInput});
    
} 