// grab the things we need
var mongoose = require('mongoose'); 
const orderSchema = new mongoose.Schema({
    orderDate:{
        type: Date, 
        default: Date.now,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    
    products:[
      {
          type: mongoose.Schema.Types.Mixed,
          required:true,
        productId:{
            type:mongoose.Schema.Types.ObjectId, 
            ref:'Product'
        },
        quantity:{
            type:Number,
            default :1
        }
    }
    ],
    shippingAddress:{
        type:String,
        required:true
        },
    paymentType:{
        type : String,
        enum:['CashOnDelivery', 'DebitOrCredit', 'BankTransfer'],
        required : true
    },
    status:{
        type : String,
        enum:['Processing', 'Shipped', 'Placed'],
        default : "Placed"
    }
    });

  
    

var CreateOrders = mongoose.model('order', orderSchema);

// make this available to our users in our Node applications
module.exports = CreateOrders;
