// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var cartSchema = new Schema({
  productId: String,
  userId:String,
  price: String,
  quantity:String
});

// the schema is useless so far
// we need to create a model using it
var CreateCart = mongoose.model('Cart', cartSchema);

// make this available to our users in our Node applications
module.exports = CreateCart;
