# mycron

Monitoring cronjobs at your servers via ssh connection

It is available through npm

```
npm install mycron
```

## Usage

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

## Sample Response

```json
  [ 
    {
      time: moment("2017-11-30T00:25:00.000"),
      job: 'NODE_ENV=prod node $HOME/scripts/test1.js',
      remainingTime: 'in a minute'
    }, 
    {
      time: moment("2017-11-30T01:30:00.000"),
      job: 'NODE_ENV=prod node $HOME/scripts/test2.js',
      remainingTime: 'in an hour and 6 minutes'
    },
    {
      time: moment("2017-11-31T06:00:00.000"),
      job: php $HOME/scripts/test3.php',
      remainingTime: 'in a day, 5 hours and 36 minutes'
    }
  ]
```


## License

MIT
