// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var productSchema = new Schema({
  name: String,
  desc: String,
  price: String
});

// the schema is useless so far
// we need to create a model using it
var CreateProduct = mongoose.model('Product', productSchema);

// make this available to our users in our Node applications
module.exports = CreateProduct;
