'use strict';

var exec = require('ssh-exec'),
    _ = require('lodash'),
    parser = require('cron-parser'),
    moment = require('moment-timezone'),
    error = require('./helpers/error'),
    constants = require('./resources/constants');

function crontab() {}


crontab.get = function get (params, options, callback) {
    
    if(_.isUndefined(params.user) || _.isUndefined(params.host)){
        return 'error: ' + error(constants.errorCodes.missingToken);
    }

    var uri = params.user + '@' + params.host;

    if(_.isUndefined(params.password) || _.isUndefined(params.key)) {
        sshAuth = uri;
    }
    else {
        var sshAuth = {
            user: params.user,
            host: params.host,
            password: params.password,
            key: params.key
        };
    }

    exec('crontab -l', sshAuth, function (err, crontab, stderr) {
        if(err) {
            return 'error: ' + error(constants.errorCodes.unableToAuthenticate);
        }

        //split crontab into array and remove command lines
        var cronArray = crontab.split('\n');
        for(var i = 0 ; i < cronArray.length ; i++) {
            if(cronArray[i][0] == "#" || cronArray[i] == "") {
                cronArray.splice(i, 1);
                i--;
            }
        }

        //parse crontabs
        var parsedCrontab = [];
        for(var i = 0 ; i < cronArray.length ; i++) {
            var cronTimeExpression = '';
            var cronJob = '';
            for(var j = 0 ; j < cronArray[i].length ; j++) {
                var currChar = cronArray[i][j]
                if(currChar == "*" || !isNaN(currChar) || currChar == "," || currChar == "/" || currChar == " ") {
                    cronTimeExpression += currChar;
                }
                else{
                    cronJob = cronArray[i].substr(j);
                    break;
                }
            }
            var interval = parser.parseExpression(cronTimeExpression);
            parsedCrontab.push({
                time: interval.next()._date,
                job: cronJob

            });
        }


        //sort crontab via next interval
        parsedCrontab.sort(compare);

        function compare(a,b) {
            if (a.time < b.time)
                return -1;
            if (a.time > b.time)
                return 1;
            return 0;
        }

        //calculate remaining time to next interval
        var now = moment(new Date()); //now's date
        for(var i = 0 ; i < parsedCrontab.length ; i++) {
            var remainingTime = '';

            var nextInterval = parsedCrontab[i].time;
            var duration = moment.duration(now.diff(nextInterval));
            var minutes = Math.ceil(-duration.asMinutes());

            if(minutes >= 1440) { //more than or equal to a day
                if(minutes / 1440 < 2) { //day(s)
                    remainingTime += 'in a day';
                } else {
                    remainingTime += 'in ' + Math.floor(minutes/1440) + ' days';
                }
                minutes %= 1440;

                if(minutes > 60) { //hour(s)
                    remainingTime += minutes % 60 > 0 ? ', ' : ' and ';
                    if(minutes / 60 < 2) {
                        remainingTime += 'an hour';
                    } else {
                        remainingTime += Math.floor(minutes/60) + ' hours';
                    }
                }
                minutes %= 60;

                if(minutes > 0){ //(minutes)
                    remainingTime += ' and ';
                    if(minutes == 1) {
                        remainingTime += 'minute';
                    } else {
                        remainingTime += minutes + ' minutes';
                    }
                }
            }
            else if(minutes >= 60){ //more than or equal to an hour
                if(minutes / 60 < 2) { //hour(s)
                    remainingTime += 'in an hour';
                } else {
                    remainingTime += 'in ' + Math.floor(minutes/60) + ' hours';
                }
                minutes %= 60;

                if(minutes > 0){ //minute(s)
                    remainingTime += ' and ';
                    if(minutes == 1) {
                        remainingTime += 'minute';
                    } else {
                        remainingTime += minutes + ' minutes';
                    }
                }

            } 
            else { //less than an hour
                if(minutes > 0){
                    if(minutes == 1) {
                        remainingTime += 'in a minute';
                    } else {
                        remainingTime += 'in ' + minutes + ' minutes';
                    }
                } else {
                    remainingTime = 'now';
                }
            }
            parsedCrontab[i].remainingTime = remainingTime;
        }

        
        return parsedCrontab;
    });
}

module.exports = crontab;