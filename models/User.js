var mongoose = require('mongoose');
var Code = require('./Code');

var User = mongoose.Schema({
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    }

});

//User.plugin(require('passport-local-mongoose'));

//user methods
User.methods.newCode = function() {
    var code = new Code();
    code.user_id = this.id;
    return code;
}
User.methods.getCodes = function(callback) {
    return Code.find({
        user_id: this._id
    }, callback);
};

module.exports = mongoose.model('user', User);
