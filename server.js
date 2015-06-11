var express = require('express');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var routes = require('./routes/');

var app = express();

app.set('dbhost', process.env.IP | '127.0.0.1');
app.set('dbname', 'codeMark');

mongoose.connect('mongodb://' + app.get('dbhost') + '/' + app.get('dbname'));

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
nunjucks.configure('views', { //setting up our templating engine
    autoescape: true,
    express: app,
    watch: true
});

app.use(stylus.middleware(__dirname + '/public/css'));

app.set('port', process.env.PORT || 1337); // telling  where our app runs.
app.set('ip', process.env.IP || '0.0.0.0');

app.use(express.static('public')); //static folder for things like css

app.use(bodyParser.urlencoded({ //make user input safe
    extended: false
}));

app.use(cookieParser('Life is full of mysteries. This is one of them.')); //things to track the user
app.use(session({
    secret: 'If we can discover the truth, why not seek it?.',
    resave: true,
    saveUninitialized: true
}));

app.use(routes.setup(app)); //setup them routes

var server = app.listen(app.get('port'), app.get('ip'), function() {
    var address = server.address();
    console.log("Code-Mark running on https://%s:%s",
        address.address, address.port);
});
