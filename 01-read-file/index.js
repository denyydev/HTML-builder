const fs = require('fs');

const filePath = './01-read-file/text.txt';

const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

readStream.on('data', (text) => {
  console.log(text);
});
