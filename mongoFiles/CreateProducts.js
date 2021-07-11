// grab the things we need
var mongoose = require('mongoose');
 
 

// create a schema
var productSchema = new mongoose.Schema({
  Images:[String],
  Title: String,
  Description: String,
  Quantity: Number,
  Price: Number,
  BrandName: String,
  CategoryName: String,
  SubCategoryName: String,
  AverageRating:{
    type: Number,  
    default :0        
  },
  cutOff:{
    type: Number,  
    default :0        
  },
  Attributes: [] ,
  Tag:[{
            type:String, 
            ref:'Tag'
        }]
});

// the schema is useless so far
// we need to create a model using it
var CreateProducts = mongoose.model('Product', productSchema );

// make this available to our users in our Node applications
module.exports = CreateProducts;
