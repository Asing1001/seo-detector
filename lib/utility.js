const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

function getStreamContent(stream) {
    let data = "";
    return new Promise((resolve, reject) => {
        stream.on('data', chunk => data += chunk);
        stream.on('error', reject);
        stream.on('end', () => resolve(data));
    })
}

module.exports = { getStreamContent, readFileAsync, writeFileAsync }