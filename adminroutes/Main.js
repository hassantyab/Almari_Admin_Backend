const express=require('express');
const router=express.Router();
 
var CreateProduct=require('../mongoFiles/CreateProduct');
 
  router.get('/contents',function(req,res){
  console.log(req.query.ID+"get");
  res.send({contents:req.query.ID});
  });
  router.post('/contents',function(req,res){
    res.send(req.body);
  });
// MongoDb Modules
  router.post('/createproducts',function(req,res){
      console.log( " --> createProduct" );
      console.log(req.body.name);
      var mobile = new CreateProduct({
      name: req.body.name,
      desc: req.body.desc,
      price: req.body.price
      });
      mobile.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully!');
        CreateProduct.find({}, function(err, users) {
        if (err) throw err;
        res.send(users);
        // object of all the users
        });
      });

  });

  router.get('/viewallproducts',function(req,res){
      console.log( " --> view_All_Product" );

      CreateProduct.find({}, function(err, users) {
      if (err) throw err;
      res.send(users);
      // object of all the users
      });

  });

  router.get('/viewSingleProduct',function(req,res){
      console.log( " --> view_Single_Product" );

      CreateProduct.find({ _id: req.query._id }, function(err, user) {
        if (err) throw err;

        // object of the user
        console.log("Singleuser===");
        console.log(user);
        res.send(user);
      });
  });
  router.get('/removeSingleProduct',function(req,res){
      console.log( " --> remove_Single_Product" );

      CreateProduct.findOneAndRemove({_id: req.query._id}, function(err) {
      if (err) throw err;

      // we have deleted the user
      console.log('User deleted!');
      CreateProduct.find({}, function(err, users) {
      if (err) throw err;
      res.send(users);
      // object of all the users
      });

      });
  });

  router.post('/updateproduct',function(req,res){
    CreateProduct.findById(req.body._id, function (err, tank) {
        if (err) return handleError(err);

        tank.set({ name: req.body.name });
        tank.save(function (err, updatedTank) {
          if (err) return handleError(err);
          CreateProduct.find({}, function(err, users) {
          if (err) throw err;
          res.send(users);
          // object of all the users
          });
  });

        });
  });


  function createP(name,desc,price){

    var mobile = new CreateProduct({
    name: name,
    desc: desc,
    price: price
  });
  mobile.save(function(err) {
    if (err) throw err;
    console.log('User saved successfully!');
  });
  }
 
module.exports=router;
