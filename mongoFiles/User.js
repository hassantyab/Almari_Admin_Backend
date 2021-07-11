
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
        default: " "
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    gender:{
        type: String,
        required: true
    },
    address: {
        type: String
    },
    phoneNumber:{
        type:String
    },
    favouriteProducts: [
        { type: mongoose.Schema.Types.ObjectId, ref : 'Product'}
    ],
    created:{
        type:Date,
        default:Date.now
    },
    facebookId: String,
    googleId:String 

});

User = mongoose.model('user2', userSchema, 'user2');
module.exports= User;