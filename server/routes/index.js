var express = require('express');
var router = express.Router();
var http    = require('http');
// var path = require('path');

// router.get('/', function(req, res, next) {
//     res.sendFile(path.join(__dirname, '../', '../', 'client', 'views', 'index.html'));
// });

var url = 'http://www.washingtonpost.com/sf/brand-connect/api/get_page/?custom_fields=true&id=2624';

http.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var fbResponse = JSON.parse(body);
        console.log("Got a response: ", fbResponse);
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});

module.exports = router;
