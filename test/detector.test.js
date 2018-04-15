const path = require('path');
const detector = require("../");
const test = require('ava');
const mock = require('mock-fs');
const sinon = require('sinon');
const stream = require('stream');
const cheerio = require('cheerio');
const input = require('../lib/input')

let sandbox = sinon.sandbox.create();
const filePath = "path/to/file.html";
const fileContent = "foo";

test.beforeEach(async t => {
    sandbox = sinon.sandbox.create();
    const fileSystem = {
        [filePath]: fileContent
    }

    mock(fileSystem)
})

test.afterEach(async t => {
    sandbox.restore();
    mock.restore();
})

test('detector writeConsole should call console.log', async t => {
    const logSpy = sandbox.spy(console, 'log');
    const seoDetector = new detector({
        input: filePath,
        rules: [],
    });

    await seoDetector.writeConsole()
    t.true(logSpy.called)
});

test('input filename without exception', async t => {
    const seoDetector = new detector({
        input: filePath,
        rules: [],
    });

    await seoDetector.writeConsole()
    t.pass()
});

test('input readable stream without exception', async t => {
    const seoDetector = new detector({
        input: new stream.Readable(),
        rules: [],
    });

    await seoDetector.writeConsole()
    t.pass()
});

test('customRule.validate should be called with cheerio object', async t => {
    const customRule = { validate: sandbox.spy() };


    const seoDetector = new detector({
        input: "path/to/file.html",
        rules: [customRule],
    });

    await seoDetector.writeConsole()
    t.true(customRule.validate.calledWith(cheerio.load(fileContent)))
});

// test('detector getWritable should return writable stream', async t => {
//     // const rule = {
//     //     validate: $ => $('strong').count() > 15,
//     // }

//     mock({
//         'some-file.html': ''//new Buffer([8, 6, 7, 5, 3, 0, 9])
//     });

//     const seoDetector = new detector({
//         input: filePath,
//         rules: [],
//     });

//     // await seoDetector.getWritable();
//     // await seoDetector.writeConsole()
//     // await seoDetector.writeFile()
//     t.pass();
// });