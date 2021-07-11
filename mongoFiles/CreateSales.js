// grab the things we need

var mongoose = require('mongoose'); 
const saleSchema = new mongoose.Schema({
    startDate:{
        type: Date,  
        required: true
    },    
    finishDate:{
        type: Date,  
        required: true
    },    
    saleImage:{
        type: String,  
        required: true
    },
    salePercentage:{
        type: String,  
        required: true
    },  
    products:[
      {
          type: mongoose.Schema.Types.Mixed,
          required:true,
        productId:{
            type:mongoose.Schema.Types.ObjectId, 
            ref:'Product'
        },
        cutOff:{
            type:Number,
            default :0
        }
    }
    ]
    }); 
var CreateSales = mongoose.model('sale', saleSchema);

// make this available to our users in our Node applications
module.exports = CreateSales;