const express = require ('express');
const router = express.Router ();
var CreateCategory = require ('../mongoFiles/CreateCategory');
var CreateOrders = require ('../mongoFiles/CreateOrders');
var User = require ('../mongoFiles/User');
var Pusher = require ('pusher');

var mongoose = require ('mongoose');
const jwt = require ('jsonwebtoken');
var CreateProducts = require ('../mongoFiles/CreateProducts');
var CreateUser = require ('../customerMongos/CreateUser');
var CreateAdmin = require ('../mongoFiles/CreateAdmin');
var CreateSales = require ('../mongoFiles/CreateSales');
var Reviews = require ('../mongoFiles/Reviews');
var CreateSlider = require ('../mongoFiles/CreateSlider');

// MongoDb Modules
//Slider

router.post ('/addSlider', function (req, res) {
  console.log("Slider"); 
  // console.log(req.body.products);
  CreateSlider.remove({}, function(err) {
    if (err) {
        console.log(err)
    } else {
         
  
  console.log('====================================');
  var object = new CreateSlider ({
    products: req.body.products 
  });
  object.save (function (err) {
    if (err) throw err;
    console.log("Created") 
    CreateSlider.find ({}, function (err, obj) {
      if (err) throw err;
      console.log("Found")
      console.log(obj)
      res.send (obj);
      return;
      // object of all the users
    });
  });  
  }
}
);
  
});
router.get ('/slider', function (req, res) {
  console.log("Slider"); 
   
  CreateSlider.find ({}, function (err, obj) {
    if (err) throw err;
    console.log("Found")
    console.log(obj)
    res.send (obj);
    return;
    // object of all the users
  });
   
  
});
//User Module

router.post ('/addAdmin', function (req, res) {
  CreateAdmin.find ({username: req.body.username}, function (err, review) {
    if (err) throw err;
    console.log (review);

    if (review.length != 0) {
      console.log ('Not Null , ');

      res.send (false);
      return;
    }
    if (review.length == 0) {
      console.log ('====================================');
      console.log ('Null');
      console.log ('====================================');
      var mobile = new CreateAdmin ({
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
      });
      mobile.save (function (err) {
        if (err) throw err;

        console.log ('New Admin Created Successfully!');
        CreateAdmin.find ({}, function (err, users) {
          if (err) throw err;
          res.send (users);
          return;
          // object of all the users
        });
      });
    }
  });
});
router.post ('/fetchAdmin', function (req, res) {
  CreateAdmin.find ({username: req.body.username}, function (err, review) {
    if (err) throw err;

    if (review.length != 0) {
      console.log ('found Success , ');

      res.send (review);
      return;
    }
    if (review.length == 0) {
      console.log ('Found Failed ');
      res.send (false);
      // object of all the users
    }
  });
});
router.get ('/findAdmin', function (req, res) {
  CreateAdmin.find (function (err, review) {
    if (err) throw err;

    console.log ('Found Success ');
    res.send (review);
    // object of all the users
  });
});
router.post ('/remAdmin', function (req, res) {
  CreateAdmin.findOneAndRemove ({_id: req.body._id}, function (objects) {
    if (err) throw err;

    // we have deleted the user
    console.log ('Admin deleted!');

    res.send (objects);

    // object of all the users
  });
});
router.post ('/updateAdmin', function (req, res) {
  console.log (req.body.username + '--' + req.body._id + '--' + req.body.role);
  CreateAdmin.find ({username: req.body.username}, function (err, review) {
    if (err) throw err;
    console.log (review);
    if (review.length != 0) {
      console.log ('Not Null , ');

      res.send (false);
    }
    if (review.length == 0) {
      CreateAdmin.findByIdAndUpdate (
        {_id: req.body._id},
        {
          $set: {
            username: req.body.username,
            password: req.body.password,
            role: req.body.role,
          },
        },
        function (err, tank) {
          CreateAdmin.find (function (err, review) {
            if (err) throw err;

            console.log ('Fetch All ');
            res.send (review);
            // object of all the users
          });
        }
      );
    }
  });
});

//Review Modules
router.get ('/reviewStatus', function (req, res) {
  Reviews.find ({status: 'NotSeen'}, function (err, review) {
    if (err) throw err;

    console.log ('review =====> Status:NotSeen');
    res.send (review);
    // object of all the users
  });
});
router.get ('/orderStatus', function (req, res) {
  CreateOrders.find ({status: 'Placed'}, function (err, review) {
    if (err) throw err;

    console.log ('Orders =====> Status:Placed');
    res.send (review);
    // object of all the users
  });
});
router.post ('/reviewStatusUpdate', function (req, res) {
  Reviews.findByIdAndUpdate (
    {_id: req.body._id},
    {$set: {status: 'Pending'}},
    {new: true},
    function (err, tank) {
      if (err) return handleError (err);

      mongoose
        .model ('review')
        .find ({_id: req.body._id})
        .exec (function (err, disciplines) {
          var options = [
            {
              path: 'productId',
              model: 'Product',
            },
            {
              path: 'userId',
              model: 'user',
            },
          ];

          mongoose
            .model ('review')
            .populate (disciplines, options, function (err, res1) {
              console.log (res1);
              res.send (res1);
              return;
            });
        });
    }
  );
});

router.post ('/orderStatusUpdate', function (req, res) {
  CreateOrders.findByIdAndUpdate (
    {_id: req.body._id},
    {$set: {status: 'Processing'}},
    {new: true},
    function (err, tank) {
      if (err) return handleError (err);
      mongoose
        .model ('order')
        .find ({_id: req.body._id})
        .exec (function (err, obj1) {
          var options = [
            {
              path: 'products.productId',
              model: 'Product',
            },
            {
              path: 'userId',
              model: 'user',
            },
          ];

          mongoose
            .model ('order')
            .populate (obj1, options, function (err, res1) {
              console.log ('Order Populated');
              console.log (res1);
              res.send (res1);
            });
        });
    }
  );
});

router.post ('/updateReview', function (req, res) {
  Reviews.findByIdAndUpdate (
    {_id: req.body._id},
    {$set: {status: req.body.status}},
    {new: true},
    function (err, tank) {
      if (err) return handleError (err);
      if (req.body.status == 'Accepted') {
        Reviews.aggregate ()
          .match ({
            productId: tank.productId,
          })
          .group ({
            _id: tank.productId,
            averageRatings: {$avg: '$numOfStars'},
          })
          .exec ()
          .then (averageRatings => {
            console.log ('Avgg' + averageRatings[0].averageRatings);
            console.log (averageRatings);
            CreateProducts.findByIdAndUpdate (
              {_id: tank.productId},
              {
                $set: {
                  AverageRating: averageRatings[0].averageRatings,
                },
              },
              {new: true},
              function (err, tank) {
                if (err) return handleError (err);

                res.send ('===>  ' + averageRatings);
              }
            );
          })
          .catch (err => {
            console.log ('errss');
            res.status (500).json ({
              error: err,
            });
          });

        return;
      }
      res.send ('Success');
    }
  );
});

router.get ('/allreviews', function (req, res) {
  Reviews.find ({}, function (err, review) {
    if (err) throw err;
    console.log ('review =====> ');
    console.log (review);
    var pusher = new Pusher ({
      appId: '582117',
      key: 'e2251f2e4da4cc566806',
      secret: '9ed902ab06e8d4043225',
      cluster: 'ap2',
      encrypted: true,
    });

    pusher.trigger ('almaari', 'orders', {
      count: 1,
    });

    console.log ('review =====> $$$');
    res.send (review);
    // object of all the users
  });
});
router.post ('/singleReview', function (req, res) {
  console.log ('singleReview===');

  mongoose
    .model ('review')
    .find ({_id: req.body._id})
    .exec (function (err, disciplines) {
      var options = [
        {
          path: 'productId',
          model: 'Product',
        },
        {
          path: 'userId',
          model: 'user',
        },
      ];

      mongoose
        .model ('review')
        .populate (disciplines, options, function (err, res1) {
          console.log (res1);
          res.send (res1);
        });
    });
});

router.post ('/removeReview', function (req, res) {
  console.log ('removeReview===');
  Reviews.findOneAndRemove ({_id: req.body._id}, function (err) {
    if (err) throw err;

    //  have deleted the Review
    console.log ('Product deleted!');
    console.log (req.body.productId);
    var pid = mongoose.Types.ObjectId (req.body.productId.productId);
    Reviews.aggregate ()
      .match ({
        productId: pid,
      })
      .group ({
        _id: pid,
        averageRatings: {$avg: '$numOfStars'},
      })
      .exec ()
      .then (averageRatings => {
        console.log ('qwe');
        console.log (averageRatings);
        console.log (averageRatings.length);
        if (averageRatings.length != 0) {
          console.log ('Not Undefined');
          CreateProducts.findByIdAndUpdate (
            {_id: pid},
            {
              $set: {
                AverageRating: averageRatings[0].averageRatings,
              },
            },
            {new: true},
            function (err, tank) {
              if (err) return handleError (err);

              Reviews.find ({}, function (err, reviews) {
                if (err) throw err;

                console.log ('Success');
                res.send (reviews);
              });
            }
          );
        }
        if (averageRatings.length == 0) {
          console.log (' Undefined');
          CreateProducts.findByIdAndUpdate (
            {_id: pid},
            {$set: {AverageRating: 0}},
            {new: true},
            function (err, tank) {
              if (err) return handleError (err);

              Reviews.find ({}, function (err, reviews) {
                if (err) throw err;

                console.log ('Success');
                res.send (reviews);
              });
            }
          );
        }
      });
  });
});

//Sales => Section
router.get ('/viewSales', function (req, res) {
  CreateSales.aggregate ()
    .project ({
      salePercentage: '$salePercentage',
      saleImage: '$saleImage',
      saleSize: {$size: '$products'},
    })
    .exec (function (err, sales) {
      if (err) throw err;
      res.send (sales);
      console.log ('=>', sales);
      // object of all the sales
    });
});

router.get ('/customerSingleSale', function (req, res) {
  const _id = '5b738417697e280ed036076b';

  console.log ('get');

  mongoose.model ('sale').find ().exec (function (err, disciplines) {
    var options = {
      path: 'products.productId',
      model: 'Product',
    };

    mongoose
      .model ('sale')
      .populate (disciplines, options, function (err, res1) {
        console.log (res1[0].products[0]);
        res.send (res1);
      });
  });
});

router.post ('/singleSale', function (req, res) {
  CreateSales.find ({_id: req.body._id}, function (err, user) {
    if (err) throw err;
    // object of the user
    console.log ('SingleSale===');
    res.send (user);
  });
});
//
router.post ('/addNewSale', function (req, res) {
  const sale = new CreateSales ({
    startDate: req.body.startDate,
    finishDate: req.body.finishDate,
    salePercentage: req.body.salePercentage,
    products: req.body.products,
    saleImage: req.body.saleImage,
  });
  var arrayOfProducts = req.body.products;
  sale
    .save ()
    .then (result => {
      console.log (result);
      arrayOfProducts.forEach (function (obj) {
        CreateProducts.update (
          {_id: obj.productId},
          {$set: {cutOff: obj.cutOff}},
          function (err, result) {
            console.log ('result', result);
          }
        );
        console.log ('==>' + obj.productId + '===' + obj.cutOff);
      });
      res.status (200).json ({message: 'Sale addNewSaleded'});
    })
    .catch (err => {
      console.log ('err');
      res.status (500).json ({
        error: err,
      });
    });
});

router.post ('/updateSale', function (req, res) {
  CreateSales.find ({_id: req.body._id}, function (err, user) {
    if (err) throw err;
    // object of the user

    var arrayOfProducts2 = user[0].products;
    console.log (user[0].products);

    arrayOfProducts2.forEach (function (obj) {
      CreateProducts.update (
        {_id: obj.productId},
        {$set: {cutOff: 0}},
        function (err, result) {
          console.log ('result===========================_id' + result);
        }
      );
    });
  });
  console.log ('update Sale==>');
  if (req.body.saleImage != undefined) {
    console.log ('update Sale==>NN');
    console.log (req.body.saleImage);
    CreateSales.update (
      {_id: req.body._id},
      {saleImage: req.body.saleImage},
      function (err, result) {
        console.log ('result===========================_id' + result);
      }
    );
  }
  if (req.body.saleImage == undefined) {
    console.log ('update Sale==>UU');
    console.log (req.body.saleImage);
  }
  CreateSales.findByIdAndUpdate (
    {_id: req.body._id},
    {
      $set: {
        startDate: req.body.startDate,
        finishDate: req.body.finishDate,
        salePercentage: req.body.salePercentage,
        products: req.body.products,
      },
    },
    function (err, place) {
      var arrayOfProducts = req.body.products;

      arrayOfProducts.forEach (function (obj) {
        CreateProducts.update (
          {_id: obj.productId},
          {$set: {cutOff: obj.cutOff}},
          function (err, result) {
            console.log ('result', result);
          }
        );
        console.log ('==>' + obj.productId + '===' + obj.cutOff);
      });
      res.status (200).json ({message: 'Sale Updated'});
    }
  );
});

router.post ('/updateProduct', function (req, res) {
  ///add unique attributes
  var AttrNames = [];
  var AttrValues = [];
  var tempAttr = [];
  CreateCategory.find ({categoryName: req.body.CategoryName}, function (
    err,
    users
  ) {
    if (err) throw err;
    console.log (users[0].uniqueAttributes);
    tempAttr = users[0].uniqueAttributes;
    console.log ('CP Attributes =>');

    for (var i = 0; i < tempAttr.length; i++) {
      AttrNames.push (tempAttr[i].attribute);
      AttrValues.push (tempAttr[i].value);
    }
    console.log (AttrNames);
    console.log (AttrValues);

    Object.keys (req.body.Attributes).forEach (function (key) {
      var value = req.body.Attributes[key];
      console.log (Object.keys (value) + '---' + Object.values (value));

      const index = AttrNames.findIndex (
        fruit => fruit === Object.keys (value)[0]
      );
      console.log (AttrValues[index]);
      var existingValues = AttrValues[index];

      const isexists = existingValues.filter (
        v => v === Object.values (value)[0]
      );

      if (isexists.length === 0) {
        console.log (isexists + '---NotFound' + Object.values (value)[0]);
        console.log (isexists);

        //var uniqueAttributes={'value':Object.values(value)[0]};
        // console.log(Object.keys(value)[0]+"!!!!!vv"+Object.values(value)[0]);

        CreateCategory.update (
          {
            categoryName: req.body.CategoryName,
            'uniqueAttributes.attribute': Object.keys (value)[0],
          },
          {$push: {'uniqueAttributes.$.value': Object.values (value)[0]}},
          {upsert: true},
          function (err, obj) {
            console.log ('Success' + obj);
          }
        );
      }
      if (isexists.length !== 0) {
        console.log (isexists + '---Found' + Object.values (value)[0]);
        console.log (isexists);
      }
    });

    ////
    var aas = req.body.Attributes;
    var attrCheck = req.body.TotalC;

    console.log (req.body);
    console.log ('update Product==>' + attrCheck);

    console.log (req.body.Tag.length);
    console.log ('update Image==>' + req.body.Images);
    console.log ('update Image==>' + req.body.Images);
    if (req.body.Tag.length != 0) {
      CreateProducts.findByIdAndUpdate (
        {_id: req.body._id},
        {
          $set: {
            Title: req.body.Title,
            Description: req.body.Description,
            Quantity: req.body.Quantity,
            Price: req.body.Price,
            BrandName: req.body.BrandName,
            Tag: req.body.Tag,
            CategoryName: req.body.CategoryName,
            SubCategoryName: req.body.SubCategory,
          },
        },
        function (err, place) {
          CreateProducts.update (
            {_id: req.body._id},
            {$set: {Attributes: []}},
            function (err, result) {
              console.log ('result---+++', result);
            }
          );
          CreateProducts.findOne ({_id: req.body._id}, function (
            err,
            myObject
          ) {
            if (err) throw err;
            console.log (myObject);
            for (i = 0; i <= attrCheck; i++) {
              myObject.Attributes.push (aas[i]);
            }
            myObject.save (function (err) {
              if (err) throw err;
              console.log ();
            });
          });

          if (
            req.body.Images == undefined ||
            req.body.Images2 == undefined ||
            req.body.Images3 == undefined
          ) {
            console.log ('+||' + null);

            res.status (200).json ({message: 'Product Updated'});
            return;
          }
          CreateProducts.update (
            {_id: req.body._id},
            {$set: {Images: [], Attributes: []}},
            function (err, result) {
              console.log ('result---+++', result);
            }
          );
          CreateProducts.update (
            {_id: req.body._id},
            {
              $push: {
                Images: {
                  $each: [req.body.Images, req.body.Images2, req.body.Images3],
                },
              },
            },
            {upsert: true},
            function (err) {
              res.status (200).json ({message: 'Product Updated'});
            }
          );
        }
      );
    }
    ///////////

    if (req.body.Tag.length == 0) {
      CreateProducts.findByIdAndUpdate (
        {_id: req.body._id},
        {
          $set: {
            Title: req.body.Title,
            Description: req.body.Description,
            Quantity: req.body.Quantity,
            Price: req.body.Price,
            BrandName: req.body.BrandName,
            CategoryName: req.body.CategoryName,
            SubCategoryName: req.body.SubCategory,
          },
        },
        function (err, place) {
          CreateProducts.update (
            {_id: req.body._id},
            {$set: {Attributes: []}},
            function (err, result) {
              console.log ('result---+++', result);
            }
          );
          CreateProducts.findOne ({_id: req.body._id}, function (
            err,
            myObject
          ) {
            if (err) throw err;
            console.log (myObject);
            for (i = 0; i <= attrCheck; i++) {
              myObject.Attributes.push (aas[i]);
            }
            myObject.save (function (err) {
              if (err) throw err;
              console.log ();
            });
          });

          if (
            req.body.Images == undefined ||
            req.body.Images2 == undefined ||
            req.body.Images3 == undefined
          ) {
            console.log ('+||' + null);

            res.status (200).json ({message: 'Product Updated'});
            return;
          }
          CreateProducts.update (
            {_id: req.body._id},
            {$set: {Images: [], Attributes: []}},
            function (err, result) {
              console.log ('result---+++', result);
            }
          );
          CreateProducts.update (
            {_id: req.body._id},
            {
              $push: {
                Images: {
                  $each: [req.body.Images, req.body.Images2, req.body.Images3],
                },
              },
            },
            {upsert: true},
            function (err) {
              res.status (200).json ({message: 'Product Updated'});
            }
          );
        }
      );
    }
  });
});
router.post ('/deleteSale', function (req, res) {
  console.log ('Sale delete IN');
  CreateSales.findOneAndRemove ({_id: req.body._id}, function (err) {
    if (err) throw err;
    var arrayOfProducts = req.body.products;

    arrayOfProducts.forEach (function (obj) {
      CreateProducts.update (
        {_id: obj.productId},
        {$set: {cutOff: 0}},
        function (err, result) {
          console.log ('result', result);
        }
      );
      console.log ('==>' + obj.productId + '===' + obj.cutOff);
    });
    res.send ('Deleted');
    console.log ('Sale deleted!');
  });
});
//
router.post ('/allusers', verifyTokens, function (req, res) {
  jwt.verify (req.token, 'secretkey', function (err, authData) {
    if (err) {
      res.sendStatus (403);
    } else {
      CreateUser.find ({}, function (err, users) {
        if (err) throw err;
        res.send (users);
        // object of all the users
      });
    }
  });
});
function verifyTokens (req, res, next) {
  const bearer = req.body.token;
  if (typeof bearer !== 'undefined') {
    req.token = bearer;
    next ();
  } else {
    res.sendStatus (403);
  }
}
router.post ('/createuser', function (req, res) {
  var mobile = new CreateUser ({
    gender: req.body.gender,
    firstName: req.body.fname,
    lastName: req.body.lname,
    email: req.body.email,
    password: req.body.password,
  });
  mobile.save (function (err) {
    if (err) throw err;

    console.log ('Account Created Successfully!');
    CreateUser.find ({}, function (err, users) {
      if (err) throw err;
      res.send (users);
      // object of all the users
    });
  });
});
// MongoDb Modules
router.post ('/createcategory', function (req, res) {
  console.log (' --> CreateCategory');
  console.log (req.body.c_name);
  var mobile = new CreateCategory ({
    categoryName: req.body.c_name,
  });
  mobile.save (function (err) {
    if (err) throw err;

    console.log ('Category saved successfully!');
    CreateCategory.find ({}, function (err, users) {
      if (err) throw err;
      res.send (users);
      // object of all the users
    });
  });
});
router.post ('/removecategory', function (req, res) {
  console.log (' --> RemoveCategory');

  CreateCategory.findOneAndRemove (
    {categoryName: req.body.categoryName},
    function (err) {
      if (err) throw err;

      // we have deleted the user
      console.log ('Product deleted!');
      CreateCategory.find ({}, function (err, users) {
        if (err) throw err;

        res.send (users);

        // object of all the users
      });
    }
  );
});
router.post ('/removeattribute', function (req, res) {
  console.log (' --> RemoveCategory');

  CreateCategory.update (
    {
      categoryName: req.body.categoryName,
    },
    {$pull: {uniqueAttributes: {attribute: req.body.attribute}}},
    {upsert: true},
    function (err) {
      console.log ('Unique Attribute deleted!');

      CreateCategory.update (
        {categoryName: req.body.categoryName},
        {$pull: {attributes: req.body.attribute}},
        function (err) {
          if (err) throw err;

          // we have deleted the user
          console.log ('Attribute deleted!');
          CreateCategory.find ({}, function (err, users) {
            if (err) throw err;

            res.send (users);

            // object of all the users
          });
        }
      );
    }
  );
});

router.post ('/removesubCategory', function (req, res) {
  console.log (' --> RemoveCategory');

  CreateCategory.update (
    {categoryName: req.body.categoryName},
    {$pull: {subCategory: req.body.subCategory}},
    function (err) {
      if (err) throw err;

      // we have deleted the user
      console.log ('SubCategory deleted!');
      CreateCategory.find ({}, function (err, users) {
        if (err) throw err;

        res.send (users);

        // object of all the users
      });
    }
  );
});
router.get ('/viewallcategories', function (req, res) {
  console.log (' --> view_All_Categories');

  CreateCategory.find ({}, function (err, users) {
    if (err) throw err;
    res.send (users);
    console.log ('Categories-Fetched');
    // object of all the users
  });
});
router.get ('/getSubPercategory', function (req, res) {
  console.log (req.query.categoryName);
  CreateCategory.find ({categoryName: req.query.categoryName}, function (
    err,
    users
  ) {
    if (err) throw err;
    console.log (users);
    res.send (users);
    // object of all the users
  });
});
router.get ('/viewproductspercategory', function (req, res) {
  console.log (' --> viewproductspercategory');

  CreateProducts.find ({CategoryName: req.query.CategoryName}, function (
    err,
    users
  ) {
    if (err) throw err;
    res.send (users);
    // object of all the users
  });
});
router.get ('/viewproductspersubcategory', function (req, res) {
  console.log (' --> viewproductspersubcategory');

  CreateProducts.find ({SubCategoryName: req.query.SubCategoryName}, function (
    err,
    users
  ) {
    if (err) throw err;
    res.send (users);
    // object of all the users
  });
});

router.post ('/createsubcategory', function (req, res) {
  console.log (' --> CreateSubCategory');
  console.log (req.body.p_c_name + 'pppp');
  CreateCategory.update (
    {categoryName: req.body.p_c_name},
    {$push: {subCategory: req.body.sub_name}},
    {upsert: true},
    function (err) {
      CreateCategory.find ({}, function (err, users) {
        if (err) throw err;
        res.send (users);
      });
    }
  );
});
router.post ('/createattributes', function (req, res) {
  console.log (' --> CreateAttributes');
  console.log (req.body.c_name + 'pppp');
  console.log (req.body.attributes + 'aaaa');
  var uniqueAttributes = {
    attribute: req.body.attributes,
    value: [],
  };
  var updateU = {
    $push: {
      attributes: req.body.attributes,
      uniqueAttributes,
    },
  };

  CreateCategory.update (
    {categoryName: req.body.c_name},
    updateU,
    {upsert: true},
    function (err) {
      CreateCategory.find ({}, function (err, users) {
        if (err) throw err;
        res.send (users);
      });
    }
  );
});
router.post ('/createproduct', function (req, res) {
  console.log (' --> CreateProduct');
  var product = new CreateProducts ({
    Title: req.body.Title,
    $push: {
      Images: {$each: [req.body.Images, req.body.Images2, req.body.Images3]},
    },
    Description: req.body.Description,
    Quantity: req.body.Quantity,
    Price: req.body.Price,
    BrandName: req.body.BrandName,
    CategoryName: req.body.CategoryName,
    SubCategoryName: req.body.SubCategory,
  });
  product.save (function (err) {
    if (err) throw err;

    CreateProducts.update (
      {Title: req.body.Title},
      {
        $push: {
          Images: {
            $each: [req.body.Images, req.body.Images2, req.body.Images3],
          },
        },
      },
      {upsert: true},
      function (err) {}
    );
    /////////image upload s3 bucket
    let imageFile = req.files.file;
    console.log (imageFile);
    let s3bucket = new AWS.S3 ({
      accessKeyId: 'AKIAJLCRJWRRAUD5XINQ',
      secretAccessKey: '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',
      Bucket: 'almari-2018',
    });
    s3bucket.createBucket (function () {
      var params = {
        Bucket: 'almari-2018',
        Key: imageFile.name,
        Body: imageFile.data,
        ContentType: 'image/jpeg',
      };
      s3bucket.upload (params, function (err, data) {
        if (err) {
          console.log ('error in callback');
          console.log (err);
        }
        console.log ('success-s3-upload');
        console.log (data);
      });
    });
    /////
    console.log ('Product saved successfully!');
    CreateProducts.find ({}, function (err, users) {
      if (err) throw err;
      res.send (users);
      // object of all the users
    });
  });
});

router.get ('/viewallproducts', function (req, res) {
  console.log (' --> view_All_Products');

  CreateProducts.find ({}, function (err, users) {
    if (err) throw err;
    res.send (users);
    // object of all the users
  });
});

router.get ('/viewSingleProduct', function (req, res) {
  console.log (' --> view_Single_Product');

  CreateProducts.find ({_id: req.query._id}, function (err, user) {
    if (err) throw err;
    console.log (req.query._id);
    // object of the user
    console.log ('Singleuser===');
    console.log (user);
    res.send (user);
  });
});
router.post ('/viewSingleUser', function (req, res) {
  console.log (' --> viewSingleUser');

  User.find ({_id: req.body.userId}, function (err, user) {
    if (err) throw err;

    // object of the user
    console.log ('Singleuser===');
    console.log (user);
    res.send (user);
  });
});

router.get ('/removeSingleProduct', function (req, res) {
  console.log (' --> remove_Single_Product');

  CreateProducts.findOneAndRemove ({_id: req.query._id}, function (err) {
    if (err) throw err;

    // we have deleted the user
    console.log ('Product deleted!');
    CreateProducts.find ({}, function (err, users) {
      if (err) throw err;
      CreateProducts.find ({}, function (err, users) {
        if (err) throw err;
        res.send (users);
        // object of all the users
      });
      // object of all the users
    });
  });
});

router.post ('/updateproductz', function (req, res) {
  CreateProducts.findById (req.body._id, function (err, tank) {
    if (err) return handleError (err);
    console.log (tank + 'pp');
    console.log ('pp=========' + req.body.Images2 + 'oooo' + req.body.Images);
    tank.set ({
      Title: req.body.Title,
      Description: req.body.Description,
      Quantity: req.body.Quantity,
      Price: req.body.Price,
      BrandName: req.body.BrandName,
      CategoryName: req.body.CategoryName,
      SubCategoryName: req.body.SubCategory,
    });
    tank.save (function (err, updatedTank) {
      if (err) return handleError (err);
      CreateProducts.update (
        {_id: req.body._id},
        {$set: {Images: []}},
        {upsert: true},
        function (err) {}
      );
      CreateProducts.update (
        {_id: req.body._id},
        {
          $push: {
            Images: {
              $each: [req.body.Images, req.body.Images2, req.body.Images3],
            },
          },
        },
        {upsert: true},
        function (err) {}
      );
      console.log ('u' + updatedTank);
      CreateProducts.find ({}, function (err, users) {
        if (err) throw err;
        res.send (users);
        // object of all the users
      });
    });
  });
});

function createP (name, desc, price) {
  var mobile = new CreateProduct ({
    name: name,
    desc: desc,
    price: price,
  });

  mobile.save (function (err) {
    if (err) throw err;

    console.log ('User saved successfully!');
  });
}
router.get ('/viewOrder', function (req, res) {
  console.log ('qweqwe');

  CreateOrders.find ({}, function (err, orders) {
    if (err) throw err;

    console.log ('orders');
    console.log (orders);
    res.send (orders);
    // object of all the users
  });
});
router.post ('/viewSingleOrder', function (req, res) {
  // CreateOrders.find({_id: req.body.oid}, function(err, order) {
  // if (err) throw err;
  console.log ('Order1 Populated1');
  mongoose
    .model ('order')
    .find ({_id: req.body.oid})
    .exec (function (err, obj1) {
      var options = [
        {
          path: 'products.productId',
          model: 'Product',
        },
        {
          path: 'userId',
          model: 'user',
        },
      ];

      mongoose.model ('order').populate (obj1, options, function (err, res1) {
        console.log ('Order Populated');
        console.log (res1);
        res.send (res1);
      });
    });
  // console.log("========> ordersSingle");
  // console.log(order);
  // res.send(order);
  // // object of all the users
  // });
});
router.get ('/removeOrder', function (req, res) {
  CreateOrders.findOneAndRemove ({_id: req.query._id}, function (err) {
    if (err) throw err;
    // we have deleted the user
    console.log ('Order deleted!');
    CreateOrders.find ({}, function (err, orders) {
      if (err) throw err;
      CreateOrders.find ({}, function (err, orders) {
        if (err) throw err;
        res.send (orders);
        // object of all the users
      });
      // object of all the users
    });
  });
});
router.post ('/updateOrder', function (req, res) {
  console.log ('=> Update Order !');
  CreateOrders.findById (req.body._id, function (err, tank) {
    if (err) throw err;

    tank.set ({status: req.body.status});
    tank.save (function (err, updatedTank) {
      if (err) throw err;

      mongoose
        .model ('order')
        .find ({_id: req.body._id})
        .exec (function (err, obj1) {
          var options = [
            {
              path: 'products.productId',
              model: 'Product',
            },
            {
              path: 'userId',
              model: 'user',
            },
          ];

          mongoose
            .model ('order')
            .populate (obj1, options, function (err, res1) {
              console.log ('Order Populated' + tank.products.length);
              console.log (tank.products);
              var t = tank.products;
              const main = async () => {
                for (var i = 0; i < tank.products.length; i++) {
                  console.log (
                    tank.products[i].quantity +
                      '--' +
                      tank.products[i].productId
                  );
                  const token = await CreateProducts.findById (
                    {_id: tank.products[i].productId},
                    function (err, res2) {
                      if (err) throw err;
                      console.log (
                        tank.products[i].quantity +
                          'result' +
                          res2.Quantity +
                          '------' +
                          i
                      );
                      // console.log(t[i]);
                      console.log ('res2');
                      // console.log(res2);
                      var aa = t[i].quantity;
                      var qu = res2.Quantity - t[i].quantity;
                      CreateProducts.update (
                        {_id: tank.products[i].productId},
                        {
                          $set: {Quantity: qu},
                        },
                        function (err, result) {
                          //     console.log(tank.products[i].productId+"res"+qu+"ult",result.Quantity)
                        }
                      );
                    }
                  );
                }
              };
              main ().catch (console.error);
              res.send (res1);
            });
        });
    });
  });
});
module.exports = router;
