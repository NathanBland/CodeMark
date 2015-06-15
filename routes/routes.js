var express = require("express");
var ensureLogin = require('connect-ensure-login');
var hl = require('highlight.js');
var User = require('../models/User');
var ensureAuthenticated = ensureLogin.ensureAuthenticated;

exports.setup = function() {
  var router = express.Router();

  router.all('/dashboard', ensureAuthenticated('/login'));
  router.all('/dashboard/*', ensureAuthenticated('/login'));
  router.all('/code/add', ensureAuthenticated('/login'));

  router.get('/', function(req, res, next) { //index route
    res.render('index', {
      title: "CodeMark"
    });
  });
  router.get('/dashboard', function(req, res, next) {
    req.user.getCodes()
      .sort({
        _id: -1
      })
      .exec(function(err, codes) {
        res.render('dashboard', {
          title: "Your Saved Code - CodeMark",
          codes: codes
        });
      });
  });
  router.post('/code/add', function(req, res, next) {
    var code = req.user.newCode();
    //console.log(req.body);
    if (!req.body.code || req.body.code === "" || req.body.code.length < 1) {
      return res.status(400).send("bad request");
    }

    //highlight with highlight.js. No idea if this works.
    var newCode = req.body.code;
    newCode = newCode.replace(/\r\n\r\n/g, "</p><p>").replace(/\n\n/g, "</p><p>");
    newCode = newCode.replace(/\r\n/g, "<br />").replace(/\n/g, "<br />");
    newCode = hl.highlightAuto(req.body.code);
    //console.log(newCode);//prints highlighted things.

    code.set({
      title: req.body.title || '',
      code: newCode.value,
      lang: newCode.language
    });
    code.save(function(err) {
      if (err) {
        res.status(500).send("Server error");
      } else {
        return res.redirect('/dashboard');
        console.log(res.req.body);
      }
    });
  });
  return router;
}
