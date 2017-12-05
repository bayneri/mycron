# mycron

Allows monitoring and creating cronjobs via ssh connection

It is available through npm

```
$ npm install mycron
```

## getCrons

``` js
var mycron = require('mycron')

// if your computer is trusted by server

var params = {
  user: 'username',
  host: 'host_url'
}

// or using the more settings

var params = {
  user: 'username',
  host: 'myremote.com',
  password: 'passw0rd',
  key: myKeyFileOrBuffer
}

//and get your crons

mycron.getCrons(params, function(crons){
  console.log(crons);
  //or whatever you want to do
});
```

The response is an array which contains cronjobs sorted by remaining times to next interval in ascending order

### Sample Responses

- ![#4bb453](https://placehold.it/15/4bb543/000000?text=+) `success:`
```json
  [ 
    {
      time: 2017-11-30T00:25:00.000,
      job: 'NODE_ENV=prod node $HOME/scripts/test1.js',
      remainingTime: 'in a minute'
    }, 
    {
      time: 2017-11-30T01:30:00.000,
      job: 'NODE_ENV=prod node $HOME/scripts/test2.js',
      remainingTime: 'in an hour and 6 minutes'
    },
    {
      time: 2017-11-31T06:00:00.000,
      job: php $HOME/scripts/test3.php',
      remainingTime: 'in a day, 5 hours and 36 minutes'
    }
  ]
```
- ![#d8000c](https://placehold.it/15/d8000c/000000?text=+) `error`
``` json
  error: **error_code**
```

## addCrons


``` js
var mycron = require('mycron')

// if your computer is trusted by server

var params = {
  user: 'username',
  host: 'host_url'
}

// or using the more settings

var params = {
  user: 'username',
  host: 'myremote.com',
  password: 'passw0rd',
  key: myKeyFileOrBuffer
}

// define your cronjob(s) as string

var cronjob = "00 09 * * 1-5 echo hello"

// and add your cronjob(s) to crontab

mycron.addCrons(params, crons, function(res){
  console.log(res);
});
```

### Sample Responses

- ![#4bb453](https://placehold.it/15/4bb543/000000?text=+) `success:`
``` json
  cronjob(s) created: 00 09 * * 1-5 echo hello
```
- ![#d8000c](https://placehold.it/15/d8000c/000000?text=+) `error`
``` json
  error: **error_code**
```

## License

MIT
