const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    category: String,
    keywords: String,
    heading: String,
    introduction: String,
    mainImage: String,
    content: [ String ],
    affilliateLink: String,
    productLink: String,
    buttonText: String,
    video:String,
    author: {type: Schema.Types.ObjectId, ref: 'User'}
});
module.exports.SaArticle = mongoose.model('SaArticle', articleSchema);
module.exports.MyArticle = mongoose.model('MyArticle', articleSchema);
module.exports.UsArticle = mongoose.model('UsArticle', articleSchema);