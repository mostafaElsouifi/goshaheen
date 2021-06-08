const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    heading: String,
    mainContent: String,
    mainImage: String,
    article: [ String ],
    affilliateLink: String,
    buttonText: String,
    video:String,
    author: {type: Schema.Types.ObjectId, ref: 'User'}
});
module.exports.SaArticle = mongoose.model('SaArticle', articleSchema);
module.exports.MyArticle = mongoose.model('MyArticle', articleSchema);
module.exports.UsArticle = mongoose.model('UsArticle', articleSchema);