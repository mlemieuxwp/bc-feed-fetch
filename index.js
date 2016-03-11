var https = require('https'),
    http = require('http'),
    express = require('express'),
    util = require('util'),
    path = require('path'),
    fs = require('fs'),
    colors = require('colors'),
    httpProxy = require('./lib/http-proxy'),
    fixturesDir = path.join(__dirname, 'test', 'fixtures'),
    url = require('url');
//
// Create the target HTTP server
//
http.createServer(function(request, response) {
    var queryData = url.parse(request.url, true).query;
    var data = '';
    http.get({
        host: 'www.washingtonpost.com',
        path: queryData.url,
        headers: {'Content-Type': 'application/json' }
    }, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(d) {
            data += d;
        });

        res.on('end', next);
    });

    function next() {
        response.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*', 'Cache-Control': 'no-cache' });
    	response.write(data);
    	response.end();
    }
}).listen(9009);

httpProxy.createServer({
    target: 'http://127.0.0.1:9009',
    ssl: {
        key: fs.readFileSync(path.join(fixturesDir, 'agent2-key.pem')),
        cert: fs.readFileSync(path.join(fixturesDir, 'agent2-cert.pem')),
        ciphers: 'AES128-GCM-SHA256'
    }
}).listen(8009);

console.log('https proxy server'.blue + ' started '.green.bold + 'on port '.blue + '8009'.yellow);
console.log('http server '.blue + 'started '.green.bold + 'on port '.blue + '9009 '.yellow);
