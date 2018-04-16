const path = require('path');
const fs = require('fs');
const { test } = require('ava');
const mockFs = require('mock-fs');
const sinon = require('sinon');
const cheerio = require('cheerio');
const { Detector } = require("../");
const { getFakeReadableStream } = require('./testUtil')

let sandbox = sinon.sandbox.create();

test.beforeEach(t => {
    sandbox = sinon.sandbox.create();
})

test.afterEach(t => {
    sandbox.restore();
})

test('constructor throw error when missing input', t => {
    const err = t.throws(() => new Detector({ rules: [{}] }), Error)
    t.is(err.message, "No input found")
});

test('constructor throw error when missing rules', t => {
    const err = t.throws(() => new Detector({ input: "path/to/file" }), Error)
    t.is(err.message, "No rules found")
});

test('writeConsole() should call logger with validate result', async t => {
    const logger = { log: sandbox.stub(), warn: sandbox.stub() }
    const validateResult = ["validate result"];
    const rules = [{ validate: $ => validateResult }]
    const seoDetector = new Detector({
        input: getFakeReadableStream(),
        rules,
        logger
    });

    await seoDetector.writeConsole()
    t.true(logger.log.calledWith(validateResult[0]))
});

test('should warn if rule.validate() return not array', async t => {
    const rules = [{ validate: () => { } }]
    const logger = { log: sandbox.stub(), warn: sandbox.stub() }
    const html = "<html></html>";
    const seoDetector = new Detector({
        input: getFakeReadableStream(html),
        logger,
        rules,
    });

    await seoDetector.writeConsole();
    t.true(logger.warn.calledWith("rule.validate should return array"))
});

test('rule.validate() called with cheerioStatic', async t => {
    const rules = [{ validate: sandbox.spy() }];
    const logger = { log: sandbox.stub(), warn: sandbox.stub() }
    const html = "<html></html>";
    const seoDetector = new Detector({
        input: getFakeReadableStream(html),
        logger,
        rules,
    });

    await seoDetector.writeConsole();
    t.true(rules[0].validate.calledWithMatch(cheerio.load(html)))
});

test('getReadableStream() on data should be error chunks', async t => {
    const validateResult = ["err", "err1", "err2"];
    const rules = [{ validate: $ => validateResult }]
    const seoDetector = new Detector({
        input: getFakeReadableStream(),
        rules,
    });

    const readableStream = await seoDetector.getReadableStream()
    // readableStream.pipe(process.stdout)
    return new Promise(resolve => {
        const data = [];
        readableStream.on('data', chunk => data.push(chunk.toString()));
        readableStream.on('end', () => {
            t.deepEqual(data, validateResult)
            resolve()
        });
    })
});

test('writeFile() result should be errors concat with \\n', async t => {
    const outPutFilePath = 'path/to/output.txt'
    mockFs({
        [outPutFilePath]: ""
    })

    const validateResult = ["error", "error1"];
    const validateResult1 = ["error", "error1"];
    const rules = [{ validate: $ => validateResult }, { validate: $ => validateResult1 }]
    const seoDetector = new Detector({
        input: getFakeReadableStream(),
        rules,
    });

    await seoDetector.writeFile(outPutFilePath)
    t.is(fs.readFileSync(outPutFilePath, 'utf8'), [...validateResult, ...validateResult1].join('\n'))
    mockFs.restore()
});