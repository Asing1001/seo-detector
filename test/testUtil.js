const { Readable } = require('stream');

const getFakeReadableStream = (content) => {
    const readableStream = new Readable();
    readableStream.push(content);
    readableStream.push(null);
    return readableStream;
}

module.exports = { getFakeReadableStream }
