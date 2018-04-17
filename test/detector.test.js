const path = require('path');
const fs = require('fs');
const { test } = require('ava');
const mockFs = require('mock-fs');
const sinon = require('sinon');
const cheerio = require('cheerio');
const { Detector } = require("../");
const { getFakeReadableStream } = require('./testUtil')

let sandbox, logger;

test.beforeEach(t => {
    sandbox = sinon.sandbox.create();
    logger = { log: sandbox.stub(), warn: sandbox.stub() }
})

test.afterEach(t => {
    sandbox.restore();
})

test('constructor throw when no input', t => {
    t.throws(() => new Detector())
});

test('constructor throw when no rules', t => {
    t.throws(() => new Detector({ input: "path/to/file" }))
});

test('constructor throw when input empty', t => {
    const err = t.throws(() => new Detector({ input: "", rules: [{}] }), Error)
    t.is(err.message, "No input found")
});

test('constructor throw error when rules empty', t => {
    const err = t.throws(() => new Detector({ input: "path/to/file", rules: [] }), Error)
    t.is(err.message, "No rules found")
});

test('writeConsole() should call rule.validate($) with cheerioStatic', async t => {
    const rules = [{ validate: sandbox.spy() }];
    const html = "<html></html>";
    const seoDetector = new Detector({
        input: getFakeReadableStream(html),
        logger,
        rules,
    });

    await seoDetector.writeConsole();
    t.true(rules[0].validate.calledWithMatch(cheerio.load(html)))
});

test('Call logger.warn() when any rule.validate() not return array', async t => {
    const rules = [{ validate: () => { } }]
    const html = "<html></html>";
    const seoDetector = new Detector({
        input: getFakeReadableStream(html),
        logger,
        rules,
    });

    await seoDetector.writeConsole();
    t.true(logger.warn.calledWith("rule.validate($) should return array"))
});

test('writeConsole() call logger with validate results from one rule', async t => {
    const validateResults = ["err1", "err2"];
    const rules = [{ validate: $ => validateResults }]
    const seoDetector = new Detector({
        input: getFakeReadableStream(),
        rules,
        logger
    });

    await seoDetector.writeConsole()
    validateResults.forEach(result=>{
        t.true(logger.log.calledWith(result))
    })    
});

test('writeConsole() call logger with validate results from two rules', async t => {
    const validateResults = ["err1", "err2"];
    const validateResults1 = ["err3", "err4"];
    const rules = [{ validate: $ => validateResults }, { validate: $ => validateResults1 }]
    const seoDetector = new Detector({
        input: getFakeReadableStream(),
        rules,
        logger
    });

    await seoDetector.writeConsole()
    validateResults.concat(validateResults1).forEach(result=>{
        t.true(logger.log.calledWith(result))
    })    
});

test(`getReadableStream() should call rule.validate($) with cheerioStatic`, async t => {
    const rules = [{ validate: sandbox.spy() }];
    const html = "<html></html>";
    const seoDetector = new Detector({
        input: getFakeReadableStream(html),
        logger,
        rules,
    });

    await seoDetector.getReadableStream();
    t.true(rules[0].validate.calledWithMatch(cheerio.load(html)))
});

test(`getReadableStream() on('data') should be error chunks from rule validate results`, async t => {
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

test(`writeFile() should call rule.validate($) with cheerioStatic`, async t => {
    const outPutFilePath = 'path/to/output.txt'
    mockFs({
        [outPutFilePath]: ""
    })
    const rules = [{ validate: sandbox.spy() }];
    const html = "<html></html>";
    const seoDetector = new Detector({
        input: getFakeReadableStream(html),
        logger,
        rules,
    });

    await seoDetector.writeFile(outPutFilePath);
    t.true(rules[0].validate.calledWithMatch(cheerio.load(html)))
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