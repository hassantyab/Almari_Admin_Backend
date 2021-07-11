// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var categorySchema = new Schema({
  categoryName: String,
  iconUri: String,
  subCategory: [String],
  attributes: [String],
  uniqueAttributes:
  	[ { 
  		 attribute:String  , value: [String] , _id : false  }]
});

// the schema is useless so far
// we need to create a model using it
var CreateCategory = mongoose.model('Category', categorySchema);

// make this available to our users in our Node applications
module.exports = CreateCategory;
