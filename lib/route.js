'use strict'

var crontab = require('./crontab');

function route() {}

route.getCrons = function getCrons (params, callback) {
    crontab.get(params, function(result){
        callback(result);
    })
};

module.exports = route;