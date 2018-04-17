const cheerio = require('cheerio');
const { test } = require('ava');
const { rule } = require("../");

test('imgShouldWithAlt: no img no errors', async t => {
    const actual = rule.preDefined.imgShouldWithAlt.validate(
        cheerio.load(
            `<h1></h1>`));
    t.deepEqual(actual, []);
});

test('imgShouldWithAlt: img with alt no errors', async t => {
    const actual = rule.preDefined.imgShouldWithAlt.validate(
        cheerio.load(
            `<img src="foo" alt="alt" />
            <img src="foo" alt="bar"/>`));
    t.deepEqual(actual, [])
});

test('imgShouldWithAlt: img without alt return an error', async t => {
    const actual = rule.preDefined.imgShouldWithAlt.validate(
        cheerio.load(
            `<img src="foo" />`));
    t.is(actual.length, 1);
});

test('imgShouldWithAlt: two img without alt return one error with count 2', async t => {
    const actual = rule.preDefined.imgShouldWithAlt.validate(
        cheerio.load(
            `<img src="foo" />
            <img src="foo" />`));
    t.deepEqual(actual, [`There are 2 <img> tag without alt attribute`])
});

test('anchorShouldWithRel: no a no errors', async t => {
    const actual = rule.preDefined.anchorShouldWithRel.validate(
        cheerio.load(
            `<body></body>`));
    t.deepEqual(actual, []);
});

test('anchorShouldWithRel: a with rel no errors', async t => {
    const actual = rule.preDefined.anchorShouldWithRel.validate(
        cheerio.load(
            `<a src="foo" rel="rel" />
            <a src="foo" rel="bar"/>`));
    t.deepEqual(actual, [])
});

test('anchorShouldWithRel: a without rel return an error', async t => {
    const actual = rule.preDefined.anchorShouldWithRel.validate(
        cheerio.load(
            `<a src="foo" />`));
    t.is(actual.length, 1);
});

test('anchorShouldWithRel: two a without rel return one error with count 2', async t => {
    const actual = rule.preDefined.anchorShouldWithRel.validate(
        cheerio.load(
            `<a src="foo" />
            <a src="foo" />`));
    t.deepEqual(actual, [`There are 2 <a> tag without rel attribute`])
});

test('head: no <head> no error', async t => {
    const actual = rule.preDefined.head.validate(
        cheerio.load(
            `<body></body>`))
    t.deepEqual(actual, [])
});

test('head: has <title>, <meta name="descriptions"/>, <meta name="keywords"/> no error', async t => {
    const actual = rule.preDefined.head.validate(
        cheerio.load(
            `<head>
            <title></title>
            <meta name="descriptions"/>
            <meta name="keywords"/>
            </head>`))
    t.deepEqual(actual, [])
});

test('head: without <title> have an error', async t => {
    const actual = rule.preDefined.head.validate(
        cheerio.load(
            `<head>
            <meta name="descriptions"/>
            <meta name="keywords"/>
            </head>`))
    t.deepEqual(actual, ["This html without <title> tag"])
});

test('head: without <meta name="descriptions"/> have an error', async t => {
    const actual = rule.preDefined.head.validate(
        cheerio.load(
            `<head>
            <title></title>
            <meta name="keywords"/>
            </head>`))
    t.deepEqual(actual, [`This html without <meta name="descriptions"> tag`])
});

test('head: without <meta name="keywords"/> have an error', async t => {
    const actual = rule.preDefined.head.validate(
        cheerio.load(
            `<head>
            <title></title>
            <meta name="descriptions">            
            </head>`))
    t.deepEqual(actual, [`This html without <meta name="keywords"> tag`])
});

test('strongLimit(): should have function validate', async t => {
    const limitRule = rule.preDefined.strongLimit();
    t.is(typeof limitRule.validate, 'function')    
});

test('strongLimit(0): no <strong> no error ', async t => {
    const limit = 0;
    const actual = rule.preDefined.strongLimit(limit).validate(
        cheerio.load(
            `<body>
            </body>`), limit)
    t.deepEqual(actual, [])
});

test('strongLimit(0): 1 <strong> have error ', async t => {
    const limit = 0;
    const actual = rule.preDefined.strongLimit(limit).validate(
        cheerio.load(
            `<body>
            <strong>1</strong>
            </body>`), limit)
    t.deepEqual(actual, [`There are more than ${limit} strong tag`])
});

test('strongLimit(15): 16 <strong> have error ', async t => {
    const limit = 15;
    const actual = rule.preDefined.strongLimit(limit).validate(
        cheerio.load(
            `<body>
            <strong></strong><strong></strong><strong></strong><strong></strong><strong></strong>
            <strong></strong><strong></strong><strong></strong><strong></strong><strong></strong>
            <strong></strong><strong></strong><strong></strong><strong></strong><strong></strong>
            <strong></strong>
            </body>`), limit)
    t.deepEqual(actual, [`There are more than ${limit} strong tag`])
});

test('H1Limit1: no <h1> no error ', async t => {
    const actual = rule.preDefined.H1Limit1.validate(
        cheerio.load(
            `<body>
            </body>`))
    t.deepEqual(actual, [])
});

test('H1Limit1: one <h1> no error ', async t => {
    const actual = rule.preDefined.H1Limit1.validate(
        cheerio.load(
            `<body>
            <h1></h1>
            </body>`))
    t.deepEqual(actual, [])
});

test('H1Limit1: two <h1> have error ', async t => {
    const actual = rule.preDefined.H1Limit1.validate(
        cheerio.load(
            `<body>
            <h1></h1><h1></h1>
            </body>`))
    t.deepEqual(actual, [`There are more than 1 h1 tag`])
});