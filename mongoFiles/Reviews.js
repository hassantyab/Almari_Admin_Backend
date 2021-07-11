// grab the things we need 
var mongoose = require('mongoose'); 
const reviewSchema = new mongoose.Schema({
    reviewString:{
        type: String,  
        required: true
    },    
    reviewTitle:{
        type: String,  
        required: true
    },    
    numOfStars:{
        type: Number,  
        required: true
    },   
    status:{
        type: String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'user'
    }, 
    productId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'Product'
    }   
    });  
var Reviews = mongoose.model('review', reviewSchema,'review');

// make this available to our users in our Node applications
module.exports = Reviews;