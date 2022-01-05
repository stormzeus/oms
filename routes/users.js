// Handles Login and Register, along with some other redirects.

var express = require('express');
var router = express.Router();
let alert = require('alert');
var monk  =require('monk');

var db=monk('localhost:27017/oms');
var collection=db.get('users');


var collection_library = db.get('music_library');

var mid;


router.get('/',function(req,res){

  collection.find({},function(err, user){
        if(err) throw err;
        res.json(user);
    });
})



router.get('/login',function(req,res){
  res.render('login')
})

router.get('/register',function(req,res){
  res.render('register')
})

// form validation and password hashing
const bodyParser = require('body-parser')
const Bcrypt = require("bcryptjs")
const Mongoose = require("mongoose");
const { response } = require('express');
const { check, validationResult } = require('express-validator')
const urlencodedParser = bodyParser.urlencoded({ extended: false })


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extend: true }));

Mongoose.connect("mongodb://localhost:27017/oms");

const UserModel = new Mongoose.model("user", {
  username: String,
  password: String,
  type: String
});



router.post("/register", urlencodedParser, [

  check('username', 'Username must be at least 6 characters and have 1 uppercase and 1 lowercase character')
      .exists()
      .isLength({ min: 6 })
      .custom(async(username)=>{
        var pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])");
        if(!pattern.test(username))
        {
          throw new Error("User name does not contain 1 uppercase and 1 lowercase character")
        }
        else{
          const existingUsername = await collection.findOne({username})
          console.log(existingUsername)
          if(existingUsername){
            throw new Error('Username already in use')
          }
        }
      }),
  check('email', 'Invalid Email')
      .isEmail()
      .normalizeEmail()
      .custom(async(email)=>{
        const existingUserEmail = await collection.findOne({email})
        console.log(existingUserEmail)
        if(existingUserEmail){
          throw new Error('Email already in use')
        }
      }),
  check('password', 'Passowrd must at least be 8 characters long with 1 uppercasae, 1 lowercase, 1 number, and 1 special character')
      .exists()
      .isLength({min: 6})
      .isStrongPassword(),
  check('passwordchk', 'Passwords do not match')
      .custom((value, { req }) => value === req.body.password),
],async (request, response, cb)=> {
  const errors = validationResult(request)
  if(!errors.isEmpty()) {

      const alert = errors.array()
      response.render('register', {
          alert

      })
      return cb;
  }
  else{
    try {
      request.body.password = Bcrypt.hashSync(request.body.password, 10);
    }
    catch (error) {
      response.status(500).send(error);
    }
    collection.insert({
      first_name: request.body.first,
      last_name: request.body.last,
      username: request.body.username,
      email:request.body.email,
      password:request.body.password,
      type : "user"
  },function(err,music){
      if(err) throw err;
  });

  var user_id=await collection.findOne({ username : request.body.username},function(err,user){
      if(err) throw err;
      console.log(user)
      const x=user['_id']
      collection_library.insert({
          user: x.toString(),
          liked_songs: [],
          playlists: []

      },function(err,music){
          if(err) throw err;
      });
  });
  response.redirect('/users/login')
}});




router.post("/login", async (request, response, cb) => {
  const un = request.body.username;
  try {
      var user = await UserModel.findOne({ username: request.body.username }).exec();
      if(!user) {
          alert("The username does not exist");
          return cb;
      }
      if(!Bcrypt.compareSync(request.body.password, user.password)) {
          alert("The password is invalid" );
          return cb;
      }
      if(user){

        if(user['type']=="user"){
        console.log("current user is "+un)
         mid=user['_id']
        console.log(mid)
        response.redirect('/current/'+mid)}
    
        else{
          mid=user['_id']
        console.log(mid)
         response.redirect('/current/'+mid);
          console.log("admin has logged in");
        }

    
      }
      else{
        console.log("incorrect credentials")
        res.redirect('/users/login')
      }
  } catch (error) {
      response.status(500).send(error);
  }
});









module.exports = router;
