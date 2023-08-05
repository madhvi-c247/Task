import * as http from 'http';
import * as fs from 'fs';
import { Duplex } from 'stream';
// import { Readable, Writable, Duplex } from 'stream';
const server = http.createServer(function (req, res) {
  //write a file using POST method
  if (req.method === 'GET') {
    fs.readFile('data.txt', (error, data) => {
      if (error) {
        console.log(error);
      }
      res.end(data);
    });
  }
  //read a file using GET method
  else if (req.method === 'POST') {
    const data = 'Hello...';

    fs.writeFile('data.txt', data, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  // Add one large file and read using stream
  let reader = fs.createReadStream('data.txt');
  reader.on('data', function (chunk: String) {
    chunk.toString();
  });
});



// Function to manipulate data (e.g., converting to uppercase)

function manipulateData(chunk: String): String {
  return (chunk.toString().toUpperCase());
}

const inputFilePath = 'data.txt';
const outputFilePath = 'newData.txt';

const readStream = fs.createReadStream(inputFilePath);
const writeStream = fs.createWriteStream(outputFilePath);

readStream.on('data', (chunk: String) => {
  const manipulatedChunk = manipulateData(chunk);
  writeStream.write(manipulatedChunk);
});

// Using Duplex stream
const duplexStream = new Duplex({
  read() {},
  write(chunk, encoding, callback) {
    const manipulatedChunk = manipulateData(chunk);
    this.push(manipulatedChunk);
    callback();
  },
});

const writeStreamDuplex = fs.createWriteStream(outputFilePath);

duplexStream.pipe(writeStreamDuplex);

fs.createReadStream(inputFilePath).pipe(duplexStream);


server.listen(3000);
