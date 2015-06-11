var express = require('express');
exports.setup = function(app) {
    var router = express.Router();
    var auth = require('./auth');
    var routes = require('./routes');
    router.use(auth.setup(app));
    router.use(routes.setup(app));
    return router;
};
