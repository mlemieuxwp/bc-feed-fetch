var https = require('https'),
    http = require('http'),
    express = require('express'),
    util = require('util'),
    path = require('path'),
    fs = require('fs'),
    colors = require('colors'),
    httpProxy = require('./lib/http-proxy'),
    fixturesDir = path.join(__dirname, '.', '.', 'test', 'fixtures');
//
// Create the target HTTP server 
//
var data_str = '';

http.createServer(function(request, response) {
    http.get({
        host: 'www.washingtonpost.com',
        path: '/sf/brand-connect/api/get_page/?custom_fields=true&id=2624'
    }, function(res) {
        res.on('data', function(d) {
            data_str += d;
            //console.log(d.toString());
        });

        res.on('end', next);
    });

    function next() {
        response.writeHead(200, { 'Content-Type': 'application/javascript', 'Access-Control-Allow-Origin':'*', 'Cache-Control': 'no-cache' });
    	response.write('callback('+data_str+')');
    	response.end();
    }
}).listen(9009);

//
// Create the HTTPS proxy server listening on port 8000
//
httpProxy.createServer({
    target: {
        host: 'localhost',
        port: 9009
    },
    ssl: {
        key: fs.readFileSync(path.join(fixturesDir, 'agent2-key.pem'), 'utf8'),
        cert: fs.readFileSync(path.join(fixturesDir, 'agent2-cert.pem'), 'utf8')
    }
}).listen(8009);

console.log('https proxy server'.blue + ' started '.green.bold + 'on port '.blue + '8009'.yellow);
console.log('http server '.blue + 'started '.green.bold + 'on port '.blue + '9009 '.yellow);
