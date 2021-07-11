// grab the things we need
var mongoose = require ('mongoose');
const sliderSchema = new mongoose.Schema ({
   
  products: [
     
  ],
});
var CreateSlider = mongoose.model ('sli', sliderSchema,'sli');

// make this available to our users in our Node applications
module.exports = CreateSlider;
