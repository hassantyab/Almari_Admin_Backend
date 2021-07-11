const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');

var CreateProducts=require('../mongoFiles/CreateProducts');
var CreateUser=require('../customerMongos/CreateUser');
var CreateCart=require('../customerMongos/CreateCart'); 
// MongoDb Modules
router.post('/viewlocalcartproducts', function(req,res){ 
console.log(req.body.arrayLocal );  
        CreateProducts.find({ _id:  {$in: req.body.arrayLocal}
           
        }, function(err, user) {
        if (err) throw err;

        // object of the user
        if(user.length==0){
                 console.log("Product Not Found");
                 console.log(user);

        res.json(user);
        }
        
        if(user.length!=0){
        console.log("Product in Cart Found Success");  
console.log(user);
        res.json(user); 
        } 
      });
  
});
function verifyToken(req,res,next){

const bearer=req.body.token;
if(typeof bearer!=='undefined'){
  console.log("bearer"+bearer);
req.token=bearer;
next();

}
else{
  res.sendStatus(403);
}

}
  router.post('/allusers'  ,verifyToken,function(req,res){

 
jwt.verify(req.token,'secretkey',function(err,authData){
 
   if (err) {  
    res.sendStatus(403);
   } 
   else{
    CreateUser.find({}, function(err, users) {
      if (err) throw err;
      res.send(users);
      // object of all the users
      });
   }
});
      

  });
	router.post('/createuser',function(req,res){  
      var mobile = new CreateUser({
      gender: req.body.gender,
      firstName: req.body.fname,
	  lastName: req.body.lname, 
	  email: req.body.email,
	  password: req.body.password
	});
      mobile.save(function(err) {
        if (err) throw err;

        console.log('Account Created Successfully!');  
        });
      });

 
 
        router.post('/findUser',function(req,res){ 
        console.log( " --> finding user" );
        CreateUser.find({ email: req.body.email , password: req.body.password}, function(err, user) {
        if (err) throw err;

        // object of the user
       if(user.length==0){
                 console.log("User Not Found");

        res.json(user);
       }
        
        if(user.length!=0){
        console.log("User Found Success"); 
        jwt.sign({user:user},'secretkey',(err,token)=>{
        console.log(token); 
        res.json(token);
        }); 
        } 
      });

  });
router.post('/addtocart',verifyToken,function(req,res){  
      var obj = new CreateCart({
      productId: req.body.productId,
      userId: req.body.userId,
    price: req.body.price, 
    quantity: req.body.quantity 
  });
      obj.save(function(err) {
        if (err) throw err;

        console.log('Added in Cart Successfully!');  
        });
});
router.post('/viewcart',verifyToken,function(req,res){  
        CreateCart.find({ userId: req.body.userId }, function(err, user) {
        if (err) throw err;

        // object of the user
        if(user.length==0){
                 console.log("Products Not Found");

        res.json(user);
        }
        
        if(user.length!=0){
        console.log("Products in Cart Found Success");  
        res.json(user); 
        } 
      });
  
});
router.post('/viewsinglecart',verifyToken,function(req,res){  
        CreateCart.find({ userId: req.body.userId ,productId:req.body.productId}, function(err, user) {
        if (err) throw err;

        // object of the user
        if(user.length==0){
                 console.log("Product Not Found");

        res.json(user);
        }
        
        if(user.length!=0){
        console.log("Product in Cart Found Success");  
        res.json(user); 
        } 
      });
  
});
router.post('/addlocalarraycart',verifyToken,function(req,res){  
  console.log("innnnnnnnnnnnnnnnn");
  console.log(req.body.productArray);
  for (var i=0;req.body.productArray[i]!=null;i++){
    console.log(req.body.productArray[i]);
 
      var obj = new CreateCart({
      productId: req.body.productArray[i],
      userId: req.body.userId,
    price: req.body.price, 
    quantity: req.body.quantity 
  });
      obj.save(function(err) {
        if (err) throw err;

        console.log('Added in Cart Successfully!');  
        });
 
 } 
});
router.post('/getPrice',verifyToken,function(req,res){  
  console.log("getPrice in Cart");
  CreateProducts.find({_id: req.body.productId}, function(err, user) {
        if (err) throw err; 
        res.json(user); 
      });
});
module.exports=router;
