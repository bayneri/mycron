'use strict'

var crontab = require('./crontab');

function route() {}

route.getCrons = function getCrons (params, options, callback) {
    return crontab.get(params, options, callback);
};

module.exports = route;