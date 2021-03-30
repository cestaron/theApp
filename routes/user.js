const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

// Register Form
router.get('/register', function(req, res){
  res.render('register');
});

// Register Proccess
router.post('/register', function(req,res){
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
    })
  } else {
    let newUser = new User({
      email:email,
      username:username,
      password:password
    });

    bcrypt.genSalt(10, function(err,salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success','You are now registered and can log in');
            res.redirect('/user/login');
          }
        });
      })
    })
  }

});

// Login Form
router.get('/login', function(req, res){
  res.render('login');
});

// Login Proccess
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true
  })(req, res, next);
});

// Profile Form
//router.get('/profile', function(req, res){

//})

// Logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/user/login');
});


// Get Wallet
router.get('/account/:id', ensureAuthentication, function(req, res){
  //console.log(req.params.id);
  User.findById(req.params.id, function(err, user){
    if(user.id != req.params.id){
      req.flash('danger', 'Not Authorized');
      req.flash('/');
    }
    res.render('account', {
      title: 'Account',
      user: user,
    });
  });
});

// Submit Edited Form
router.post('/edit/:id', function(req,res){
  let user = {};
  user.binanceWallet = req.body.binanceWallet;
  user.binanceUserId = req.body.binanceUserId;
  user.okexWallet = req.body.okexWallet;
  user.okexUserId = req.body.okexUserId;
  user.ftxWallet = req.body.ftxWallet;
  user.ftxUserId = req.body.ftxUserId;
  user.huobiWallet = req.body.huobiWallet;
  user.huobiUserId = req.body.huobiUserId;
  user.gateWallet = req.body.gateWallet;
  user.gateUserId = req.body.gateUserId;
  user.kucoinWallet = req.body.kucoinWallet;
  user.kucoinUserId = req.body.kucoinUserId;

  let query = {_id:req.params.id}

  User.update(query, user, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Account Updated');
      res.redirect('/user/account/'+req.params.id);
    }
  });
});


// Access Control
function ensureAuthentication(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please Login');
    res.redirect('/users/login');
  }
}

module.exports = router;
