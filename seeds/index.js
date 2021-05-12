if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const mongoose = require('mongoose');
const { Product } = require('../models/product');
const { MYProduct } = require('../models/product');
mongoose.connect(process.env.DB_URL, 
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
    )
.then(()=>{
    console.log('db connected')
})
.catch((e)=>{
    console.log('error connection')
})



const seedDb = async()=>{
    await MYProduct.deleteMany();
    const allProducts = await Product.find();
    for(let i = 0; i < allProducts.length; i++){
        const product =  new MYProduct({
            name: allProducts[i].name,
            category: allProducts[i].category,
            price: allProducts[i].price,
            images: allProducts[i].images,
            details: allProducts[i].details,
            rating:{
                number:allProducts[i].rating.number,
                stars:allProducts[i].rating.stars,
            },
            reviews: {
                images: allProducts[i].reviews.images,
                text: allProducts[i].reviews.text
            },
            video: allProducts[i].video,
            store: allProducts[i].store,
            affilliateLink: allProducts[i].affilliateLink
        });
        await product.save();
    }
}
seedDb().then(()=>{
    mongoose.connection.close();
})
