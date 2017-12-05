'use strict';

var exec = require('ssh-exec'),
    _ = require('lodash'),
    error = require('./helpers/error'),
    constants = require('./resources/constants');

function create() {}

create.new = function newCronjob (params, cronjob, callback) {
    if(_.isUndefined(params.user) || _.isUndefined(params.host)){
        callback('error: ' + error(constants.errorCodes.missingToken));
        return;
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

    var commands = ["crontab -l > mycron", "echo \"" + cronjob + "\" >> mycron", "crontab mycron", "rm mycron"];
    
    function execCommand(commands, i, sshAuth){
        return exec(commands[i], sshAuth, function (err, response, stderr) {
            if(err) {
                return false;
            }

            if(!_.isUndefined(commands[i + 1])){
                execCommand(commands, i + 1 , sshAuth);
            }

            return true;
        });
    
    }

    if(execCommand(commands, 0, sshAuth)){
        callback("cronjob(s) created: " + cronjob);
        return;
    } else{
        callback('error: ' + error(constants.errorCodes.unableToAuthenticate));
        return
    }
};

module.exports = create;