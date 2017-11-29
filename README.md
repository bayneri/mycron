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
});
```

The result is an array which contains cronjobs sorted by remaining times to next interval in ascending order

## License

MIT
