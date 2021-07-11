//ar360456@gmail.com

var express=require('express');
var fs=require('fs');
var path=require('path');
var socket = require("socket.io");
var server=express();  
var bodyParser=require('body-parser');
var mongoose = require('mongoose');
const osTmpdir = require('os-tmpdir');
var upload = require('express-fileupload');
const jsftp = require("jsftp");
const AWS = require('aws-sdk');
var http = require('http');
osTmpdir(); 
var admin="";
var CreateProducts=require('./mongoFiles/CreateProducts'); 
var CreateCategory=require('./mongoFiles/CreateCategory'); 
var JFUM = require('jfum');
var jfum = new JFUM({
  minFileSize: 204800,                      // 200 kB
  maxFileSize: 5242880,                     // 5 mB
  acceptFileTypes: /\.(gif|jpe?g|png)$/i    // gif, jpg, jpeg, png
});


var app = require( "http" ).createServer( server );
var io = require("socket.io").listen(app);
 
var ports=1950; 
app.listen( process.env.PORT || ports,()=>{
  console.log('Expressing listening on port = '+ports)});
 



io.set( "origins", "*:*" );
io.on('error', function (err) {
  console.log('received socket error:')
  console.log(err)
})
io.on('connection',function(socket){  
    console.log("A user is connected");
    socket.on('disconnect', function () {
      console.log(socket.id);
      io.to( admin ).emit("disconnect",socket.id);
    });
    socket.on('adminSocketID', (message) => { 
      // socket.id=message.id;
      console.log("admin");
        admin=socket.id; 
        socket.emit('adminSocketID',admin)
       
    });
    socket.on('updateSocketID', (message) => { 
      console.log("Socket Id => "+socket.id);
        socket.emit('updateSocketID',socket.id)
       
    });
    socket.on('private-message', function(data){ 
      console.log(data); console.log(socket.id);
      // Send to All
      // io.sockets.emit("private-message", data.message);
      var d = new Date();
      var n = d.getTime();
      var object=[{time:n,id:data.id,userName:data.userName,message:data.message,type:data.type,socketId:socket.id}]
      console.log(object); 
      io.to( admin ).emit("private-message",object[0]);
      // socket.broadcast.to(socket.id).emit("private-message", data.message);
      // console.log(data);
    });
    socket.on('to-c-private-message', function(data){ 
      console.log(data); console.log(socket.id);
      // Send to All
      // io.sockets.emit("private-message", data.message);
      var d = new Date();
      var n = d.getTime();
      var object=[{time:n,id:data.id,message:data.message,type:data.type}]
      console.log(object); 
      io.to( data.socketId ).emit("to-c-private-message",object[0]);
      // socket.broadcast.to(socket.id).emit("private-message", data.message);
      // console.log(data);
    });
    // socket.emit("FromAPI", socket.id);
    socket.on('changeColor', (message) => {
      // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
      // we make use of the socket.emit method again with the argument given to use from the callback function above
      console.log('Color Changed to: ', message+"="+socket)
      console.log( socket.id)
      console.log(  message )
      socket.emit('changeColor', message.message+"="+socket.id)
  })
});



server.use(upload());
server.use(bodyParser.json());
// req.get('Origin') || 
server.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  } else {
    return next();
  }
});
 
// var socketIo = require("socket.io");
// var io  = app.io = require( "socket.io" )();
// console.log("  server");
// io.on('connection', function (socketInstance) {
//       console.log("connected to server");
// })
  

// mongodb://127.0.0.1/smartEcom
//mongodb://imnoori:sp15bse055@ds121945.mlab.com:21945/smart-ecom
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://dummy:qwer123456@ds121945.mlab.com:21945/smart-ecom'
, (err)=>{
  if(err){
      throw err;
  }
  });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function callback () {
  console.info('Mongos db conn successfully');
});
server.options('/upload', jfum.optionsHandler.bind(jfum));

// MongoDb Modules

server.post('/upload', jfum.postHandler.bind(jfum), function(req, res) {
  // Check if upload failed or was aborted
  if (req.jfum.error) {
    // req.jfum.error  
      res.send({contents:req.jfum.error});

  } else {

      res.send({contents:"succses"});
    // Here are the uploaded files
    for (var i = 0; i < req.jfum.files.length; i++) {
      var file = req.jfum.files[i];

      // Check if file has errors
      if (file.errors.length > 0) {
        for (var j = 0; i < file.errors.length; i++) {
          // file.errors[j].code
          // file.errors[j].message
        }

      } else {
        // file.field - form field name
        // file.path - full path to file on disk
        // file.name - original file name
        // file.size - file size on disk
        // file.mime - file mime type
      }
    }
  }
});   
server.get('/contents',(req,res)=>{
  res.send({contents:"qweqwe"});
});
server.post('/ftpUpload',function(req,res){

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
       let imageFile = req.files.file;
console.log(imageFile);
// var Client = require('scp2').Client;
        //    var client = new Client({
        //      host: 'files.000webhost.com',
        //      port: 21,
        //      username: 'server-android',
        //      password: 'knowledge@',
        //        path: '/images1/'
        //    });
        //    client.upload(imageFile, '/images1', callback(err));
           // Use the mv() method to place the file somewhere on your server
    //        Access Key ID:AKIAJLCRJWRRAUD5XINQ
    // Secret Access Key:O4Gn2tiq7ScZRbRSoWTw9kQ4dAeMDrKhWGkafg8J
    // let s3bucket = new AWS.S3({
    //   accessKeyId: "AKIAJLCRJWRRAUD5XINQ",
    //   secretAccessKey:"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",
    //   Bucket: "almari-2018",
    // });
    // s3bucket.createBucket(function () {
    //   var params = {
    //    Bucket: "almari-2018",
    //    Key: imageFile.name,
    //    Body: imageFile.data,
    //     ContentType : 'image/jpeg'
    //   };
    //   s3bucket.upload(params, function (err, data) {
    //    if (err) {
    //     console.log('error in callback');
    //     console.log(err);
    //    }
    //    console.log('success-s3-upload');
    //    console.log(data);
    //   });
    // });
    //                    imageFile.mv(`${__dirname}/some/`+req.body.filename , function(err) {
    //                      if (err) {
    //                       return res.status(500).send(err);
    //                     }
    
    //                        res.json({file: `${__dirname}/some/${req.body.filename}`});
    //                    });
    //   const ftp = new jsftp({
    //   host: "files.000webhost.com",
    //   port: 21, // defaults to 2 
    //   user: "ehtisham013fp", // defaults to "anonymous"
    //   pass: "ehtisham"  ,
    //   debugMode: true // Password
    //
    // });
    // ftp.put(`${__dirname}/some/`+req.body.filename, "/mine/file.jpg", err => {
    //   if (!err) {
    //     console.log("File transferred successfully!");
    //   }
    //   else{
    //     console.log("eeee"+err);
    //   }
    // });
});


 
server.use('/api',require('./adminroutes/Main2'));
//server.use('/apis',require('./adminroutes/Main')); 
server.use('/customerapi',require('./customerpaths/Accounts')); 


  
function dbConnection(){

  // Get Mongoose to use the global promise library
  mongoose.Promise = global.Promise;
  //Get the default connection
  db = mongoose.connection;

  //Bind connection to error event (to get notification of connection errors)
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', function callback () {
    console.info('Mongo db connected successfully');
  });
}
server.post('/createproducta',function(req,res){
var AttrNames =[];var AttrValues =[];
var tempAttr=[];
  CreateCategory.find({categoryName: req.body.CategoryName}, function(err, users) {
      if (err) throw err;
      console.log(users[0].uniqueAttributes); 
      tempAttr=users[0].uniqueAttributes;
       console.log( "CP Attributes =>");
 
  for(var i=0;i<tempAttr.length;i++){
    AttrNames.push( tempAttr[i].attribute); 
    AttrValues.push( tempAttr[i].value); 
  }      
  console.log(AttrNames); 
  console.log(AttrValues);   
      
  Object.keys(req.body.Attributes).forEach(function(key){
    var value = req.body.Attributes[key];
    console.log(  Object.keys(value)+"---"+Object.values(value)); 

    const index = AttrNames.findIndex(fruit => fruit === Object.keys(value)[0]);
    console.log(   (AttrValues[index]));
    var existingValues= AttrValues[index]  ;


    const isexists = existingValues.filter(v => v === Object.values(value)[0]);
    
    if(isexists.length===0){
      console.log(isexists+"---NotFound"+Object.values(value)[0]);
      console.log(isexists);


 
      //var uniqueAttributes={'value':Object.values(value)[0]}; 
       // console.log(Object.keys(value)[0]+"!!!!!vv"+Object.values(value)[0]);

      CreateCategory.update( 
        {categoryName: req.body.CategoryName,
          'uniqueAttributes.attribute': Object.keys(value)[0] }

        , {$push:  {'uniqueAttributes.$.value': Object.values(value)[0] }  }, { upsert: true }, 
        function(err,obj) {
          console.log("Success"+obj);

        });

     
    }
    if(isexists.length!==0){
     console.log(  isexists+"---Found"+Object.values(value)[0]);
      console.log(isexists);
     
    }


  });
  
    console.log( req.body.TotalC+"< --> CreateProduct" +req.body.Attributes);
var aas=req.body.Attributes;
var attrCheck=req.body.TotalC;
    console.log(  req.body.Attributes  ); 
    var product = new CreateProducts({
      Title: req.body.Title ,
      Description: req.body.Description,
      Quantity: req.body.Quantity,
      Price: req.body.Price,
      BrandName: req.body.BrandName,
      Tag: req.body.Tag,
      CategoryName: req.body.CategoryName,
      SubCategoryName: req.body.SubCategory,
    });
    product.save(function(err) {
      if (err) throw err;

      CreateProducts.update(  {Title: req.body.Title},
      { $push: {Images: {$each:[req.body.Images,req.body.Images2,req.body.Images3]}} } , 
      { upsert: true }, function(err) {

        });
      
      CreateProducts.findOne({Title: req.body.Title}, function (err, myObject) {
          if (err) throw err;
          console.log(myObject);
          for(i=0;i<=attrCheck;i++){
          myObject.Attributes.push(aas[i]);}
          myObject.save(function(err) {
              if (err) throw err;
              console.log();
          });
        });
       
                /////////image upload s3 bucket
        /////
      console.log('Product saved successfully!');
      CreateProducts.find({}, function(err, users) {
      if (err) throw err;
      res.send(users);
      // object of all the users
      });
    });

 });


});
server.post('/createsaleimage',function(req,res){
let imageFile = req.files.file;
     console.log(imageFile);
     let s3bucket = new AWS.S3({
     accessKeyId: "AKIAJLCRJWRRAUD5XINQ",
     secretAccessKey:"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",
     Bucket: "almari-2018",
     });
     s3bucket.createBucket(function () {
     var params = {
      Bucket: "almari-2018",
      Key: imageFile.name,
      Body: imageFile.data,
       ContentType : 'image/jpeg'
     };
     s3bucket.upload(params, function (err, data) {
      if (err) {
       console.log('AAAerror in callback');
       console.log(err);
      }
      console.log('AAAsuccess-s3-upload');
      console.log(data);
     });
});
   });




server.post('/createproductimage',function(req,res){
  console.log("55555555555555555555555555555555555555555555555555555");
  // console.log(req.files.file0); 
  // console.log(req.files.file0.name);
  // console.log("ff+"+req.body.img1);
  // return;
  let s3bucket = new AWS.S3({
    accessKeyId: "AKIAJLCRJWRRAUD5XINQ",
    secretAccessKey:"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",
    Bucket: "almari-2018",
    });
  if(req.files.file0!==undefined){
let imageFile = req.files.file0;
     console.log(imageFile);
    
     s3bucket.createBucket(function () {
     var params = {
      Bucket: "almari-2018",
      Key: imageFile.name,
      Body: imageFile.data,
       ContentType : 'image/jpeg'
     };
     s3bucket.upload(params, function (err, data) {
      if (err) {
       console.log('AAAerror in callback');
       console.log(err);
      }
      console.log('AAAsuccess-s3-upload');
      console.log(data);
     });
});}

if(req.files.file1!==undefined){
let imageFile2 = req.files.file1;
     console.log(imageFile2);

     s3bucket.createBucket(function () {
     var params = {
      Bucket: "almari-2018",
      Key: imageFile2.name,
      Body: imageFile2.data,
       ContentType : 'image/jpeg'
     };
     s3bucket.upload(params, function (err, data) {
      if (err) {
       console.log('BBBerror in callback');
       console.log(err);
      }
      console.log('BBBsuccess-s3-upload');
      console.log(data);
     });
});
}
if(req.files.file2!==undefined){
  let imageFile3 = req.files.file2;
     console.log("imageFile3=>");
     console.log(imageFile3);

     s3bucket.createBucket(function () {
     var params = {
      Bucket: "almari-2018",
      Key: imageFile3.name,
      Body: imageFile3.data,
       ContentType : 'image/jpeg'
     };
     s3bucket.upload(params, function (err, data) {
      if (err) {
       console.log('CCCerror in callback');
       console.log(err);
      }
      console.log('CCCCC==== => success-s3-upload');
      console.log(data);
     });
});}
res.send(true);
});

// io.on('connection', async ({socket: any}) => {
// 	console.log("Client Successfully Connected");

// 	io.emit('chat', "hello world");
// })
// io.sockets.on('connection', function (socket) {

//   socket.on('add-user', function(data){
//     clients[data.username] = {
//       "socket": socket.id
//     };
//     console.log("User added");
//   });

//   socket.on('private-message', function(data){
//     console.log("Sending: " + data.content + " to " + data.username);
//     if (clients[data.username]){
//       io.sockets.connected[clients[data.username].socket].emit("add-message", data);
//         console.log(data);

//     } else {
//       console.log("User does not exist: " + data.username); 
//     }
//   });

//   //Removing the socket on disconnect
//   socket.on('disconnect', function() {
//   	for(var name in clients) {
//   		if(clients[name].socket === socket.id) {
//   			delete clients[name];
//   			break;
//   		}
//   	}	
//   })

// });
