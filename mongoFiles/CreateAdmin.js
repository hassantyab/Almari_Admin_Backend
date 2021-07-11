// grab the things we need 
var mongoose = require('mongoose'); 
const userSchema = new mongoose.Schema({
    username:{
        type: String,  
        required: true
    },    
    password:{
        type: String,  
        required: true
    },    
    role:{
        type: String,  
        required: true
    },   
    date:{
        type: Date, 
        default: Date.now,
    }   
    });  
var CreateAdmin = mongoose.model('adminProfiles', userSchema,'adminProfiles');

// make this available to our users in our Node applications
module.exports = CreateAdmin;