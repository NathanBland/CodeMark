var express = require("express");
var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GitHuBStrategy = require('passport-github').Strategy;
//var OAuth2Strategy = require('passport-oauth2').Strategy;
//var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/User.js');
exports.setup = function(app) {
  var router = express.Router();

var GITHUB_CLIENT_ID = "8cdfb72745293469de03";
var GITHUB_CLIENT_SECRET = "560d8d5ef2342f3b88f5877621459db95144feac";
var GITHUB_CALLBACK_URL = "http://localhost:8081/login/github/callback";

  //#################
  //GitHub
  //#################
  passport.use(new GitHuBStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: GITHUB_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({
      'github.id': profile.id
    }, function(err, user){
      if (err)
        return done(err);
      if (user) {
        return done(null, user)
      } else {
        var newUser = new User();
        newUser.github.id = profile.id;
        newUser.github.email = profile.email;
        newUser.github.username = profile.username;
        newUser.save(function(err){
          if(err)
            throw err;
          return done(null, newUser);
        })
      }
    })
  }
));


  //#################
  //end GitHub
  //#################

  //#################
  //twitter
  //#################
  passport.use(new TwitterStrategy({
    consumerKey: 'OvZLRrSI4UaOulruOPf1lYYLM',
    consumerSecret: 'H1GtwpnZnn45QJoYoAVRx4GBJCYe5WiZKW70kSBYyhcZ90Wy01',
    callbackURL: "http://localhost:8081/login/twitter/callback"
  }, function(token, tokenSecret, profile, done) {

    process.nextTick(function() {
      User.findOne({
        'twitter.id': profile.id
      }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          return done(null, user);
        } else {
          var newUser = new User();
          newUser.twitter.id = profile.id;
          newUser.twitter.token = token;
          newUser.twitter.username = profile.username;
          newUser.twitter.displayName = profile.displayName;
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));
  //#################
  //end twitter
  //#################

  //passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  router.use(passport.initialize());
  router.use(passport.session());
  //
  // Auth Routes
  //

  //#################
  //GitHub
  //#################
  router.get('/login/github', passport.authenticate('github'));
  router.get('/login/github/callback',
    passport.authenticate('github', {
      successRedirect: '/dashboard',
      failureRedirect: '/login'
    }));

  //#################
  //end GitHub
  //#################

  //#################
  //twitter
  //#################

  router.get('/login/twitter', passport.authenticate('twitter'));
  router.get('/login/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/dashboard',
      failureRedirect: '/login'
    }));

  //#################
  //end twitter
  //#################

  router.get('/login', function(req, res, next) {
    res.render('login', {
      title: "CodeMark - Login"
    });
  });
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
}
