var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    // headline: {
    //     type: String,
    //     unique: true
    // },
    headline: String,
    // summary: String,
    link: String,
    saved: Boolean
});

var Articles = mongoose.model("Articles", ArticleSchema);

module.exports = Articles;
