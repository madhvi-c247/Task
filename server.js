"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var fs = require("fs");
var stream_1 = require("stream");
// import { Readable, Writable, Duplex } from 'stream';
var server = http.createServer(function (req, res) {
    //write a file using POST method
    if (req.method === 'GET') {
        fs.readFile('data.txt', function (error, data) {
            if (error) {
                console.log(error);
            }
            res.end(data);
        });
    }
    //read a file using GET method
    else if (req.method === 'POST') {
        var data = 'Hello...';
        fs.writeFile('data.txt', data, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    // Add one large file and read using stream
    var reader = fs.createReadStream('data.txt');
    reader.on('data', function (chunk) {
        chunk.toString();
    });
});
// Function to manipulate data (e.g., converting to uppercase)
function manipulateData(chunk) {
    return (chunk.toString().toUpperCase());
}
var inputFilePath = 'data.txt';
var outputFilePath = 'newData.txt';
var readStream = fs.createReadStream(inputFilePath);
var writeStream = fs.createWriteStream(outputFilePath);
readStream.on('data', function (chunk) {
    var manipulatedChunk = manipulateData(chunk);
    writeStream.write(manipulatedChunk);
});
// Using Duplex stream
var duplexStream = new stream_1.Duplex({
    read: function () { },
    write: function (chunk, encoding, callback) {
        var manipulatedChunk = manipulateData(chunk);
        this.push(manipulatedChunk);
        callback();
    },
});
var writeStreamDuplex = fs.createWriteStream(outputFilePath);
duplexStream.pipe(writeStreamDuplex);
fs.createReadStream(inputFilePath).pipe(duplexStream);
server.listen(3000);
