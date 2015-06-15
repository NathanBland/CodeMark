var mongoose = require("mongoose");
var tagSchema = new mongoose.Schema({
    tag: String
})
var codeSchema = new mongoose.Schema({
    title: String,
    lang: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        index: true
    },
    code: String,
    origin: String, //source URL, or local paste.
    tags: [tagSchema]
});
module.exports = mongoose.model('post', codeSchema);
