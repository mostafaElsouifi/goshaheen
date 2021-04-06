const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name:{
        type:String,
        required: true,
        index: true
    },
    category:{
        type:String,
        required: true
    },
    price:{
        type: Number,
        required:true
    },
    images:[
        {
            type:String,
            required:true
        }
    ],
    details:[
        {
            type:String,
            required: true
        }
    ],
    rating: {
        number:Number,
        stars:Number
    },
    reviews:{
        text:[
            {
                type:String,
            }
        ],
        images:[
            {
                type:String
            }
        ]
    },
    video:{
        type: String
    },
    store:{
        type:String,
        required:true
    },
    affilliateLink: {
        type:String
    }


})
productSchema.index({name: 'text'})

module.exports = mongoose.model('Product', productSchema);