'use strict'

var monitor = require('./monitor');
var create = require('./create');
function route() {}

route.getCrons = function getCrons (params, callback) {
    monitor.get(params, function(result){
        callback(result);
    })
};

route.addCrons = function addCrons (params, cronjob, callback) {
    create.new(params, cronjob, function(result){
        callback(result);
    });
};


module.exports = route;