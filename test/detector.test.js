const path = require('path');
const fs = require('fs');
const { detector, builtInRule } = require("../");
const { test } = require('ava');
const mock = require('mock-fs');
const sinon = require('sinon');
const stream = require('stream');
const cheerio = require('cheerio');
const { getStreamContent } = require('../lib/utility')

let sandbox = sinon.sandbox.create();
let $ = cheerio.load("");

const inputFilePath = path.resolve(__dirname, "test.html");
const outPutFilePath = path.resolve(__dirname, "result.html");
const fileContent = fs.readFileSync(inputFilePath, 'utf8');

test.beforeEach(async t => {
    mock({
        [inputFilePath]: fileContent,
        [outPutFilePath]: ""
    })
    sandbox = sinon.sandbox.create();
})

test.afterEach(async t => {
    sandbox.restore();
})

test('constructor throw when missing args', async t => {
    t.throws(() => new detector({
        rules: []
    }))

    t.throws(() => new detector({
        input: ""
    }))

    t.throws(() => new detector({
        input: "",
        rules: []
    }))

    t.throws(() => new detector({}))
});

test('constructor input accept stream/filepath', t => {
    t.notThrows(() => new detector({
        input: inputFilePath,
        rules: [{}]
    }))

    t.notThrows(() => new detector({
        input: fs.createReadStream(inputFilePath),
        rules: [{}]
    }))
})

test('rule.validate should be called', async t => {
    const rule = { validate: sandbox.spy() };
    const seoDetector = new detector({
        input: inputFilePath,
        rules: [rule],
    });

    await seoDetector.writeConsole()
    t.true(rule.validate.called)
});

test('rule.validate called args[0] is cheerioStatic', async t => {
    const rules = [{ validate: sandbox.spy() }]
    const seoDetector = new detector({
        input: inputFilePath,
        rules,
    });

    await seoDetector.writeConsole()
    t.true(typeof rules[0].validate.getCall(0).args[0].parseHTML === 'function')
});

test('writeConsole log called with validate result', async t => {
    const logSpy = { log: sandbox.spy() };
    const validateResult = "validate result";
    const rules = [{ validate: $ => validateResult }]
    const seoDetector = new detector({
        input: inputFilePath,
        rules,
        logger: logSpy
    });

    await seoDetector.writeConsole()
    t.true(logSpy.log.calledWith(validateResult))
});

test('getReadableStream match validateResult', async t => {
    const validateResult = "validate result";
    const rules = [{ validate: $ => validateResult }]
    const seoDetector = new detector({
        input: inputFilePath,
        rules,
    });

    const rs = await seoDetector.getReadableStream()
    // rs.pipe(process.stdout)
    t.true(await getStreamContent(rs) === validateResult)
});

test('writeFile content match validateResult', async t => {
    const validateResult = "validate result";
    const rules = [{ validate: $ => validateResult }]
    const seoDetector = new detector({
        input: inputFilePath,
        rules,
    });

    await seoDetector.writeFile(outPutFilePath)
    t.true(fs.readFileSync(outPutFilePath, 'utf8') === validateResult)
});

test('Predefined rule : Detect if any `<img />` tag without alt attribute', async t => {
    builtInRule.imgWithAlt.validate(
        cheerio.load(
            `<img src="foo" alt="alt" /> <img src="foo" />`))
    t.true(builtInRule.imgWithAlt.validate(
        cheerio.load(
            `<img src="foo" alt="alt" /> <img src="foo" />`)) === `There are 1 <img> tag without alt attribute`)
});

// test('detector getWritable should return writable stream', async t => {
//     // const rule = {
//     //     validate: $ => $('strong').count() > 15,
//     // }

//     mock({
//         'some-file.html': ''//new Buffer([8, 6, 7, 5, 3, 0, 9])
//     });

//     const seoDetector = new detector({
//         input: inputFilePath,
//         rules: [],
//     });

//     // await seoDetector.getWritable();
//     // await seoDetector.writeConsole()
//     // await seoDetector.writeFile()
//     t.pass();
// });