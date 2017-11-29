'use strict'

var crontab = require('./crontab');

function CronSerw() {}

CronSerw.getCrons = function getCrons (params, options, callback) {
    return crontab.get(params, options, callback);
};

module.exports = CronSerw;