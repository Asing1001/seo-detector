const cheerio = require('cheerio');
const { test } = require('ava');
const { rule } = require("../");

test('imgShouldWithAlt: no img output no errors', async t => {
    const actual = rule.preDefined.imgShouldWithAlt.validate(
        cheerio.load(
            `<h1></h1>`));
    t.deepEqual(actual, []);
});

test('imgShouldWithAlt: img with alt output no errors', async t => {
    const actual = rule.preDefined.imgShouldWithAlt.validate(
        cheerio.load(
            `<img src="foo" alt="alt" />
            <img src="foo" alt="bar"/>`));
    t.deepEqual(actual, [])
});

test('imgShouldWithAlt: img without alt output one error', async t => {
    const actual = rule.preDefined.imgShouldWithAlt.validate(
        cheerio.load(
            `<img src="foo" />`));
    t.is(actual.length, 1);
});

test('imgShouldWithAlt: two img without alt output one error with count 2', async t => {
    const actual = rule.preDefined.imgShouldWithAlt.validate(
        cheerio.load(
            `<img src="foo" />
            <img src="foo" />`));
    t.deepEqual(actual, [`There are 2 <img> tag without alt attribute`])
});

test('anchorShouldWithRel', async t => {
    const actual = rule.preDefined.anchorShouldWithRel.validate(
        cheerio.load(
            `<a rel="url"></a>
            <a></a>`))
    t.deepEqual(actual, [`There are 1 <a> tag without rel attribute`])
});

test('<head>: no <head> no error', async t => {
    const actual = rule.preDefined.head.validate(
        cheerio.load(
            `<body></body>`))
    t.deepEqual(actual, [])
});

test('<head>: has <title>, <meta name="descriptions"/>, <meta name="keywords"/> no error', async t => {
    const actual = rule.preDefined.head.validate(
        cheerio.load(
            `<head>
            <title></title>
            <meta name="descriptions"/>
            <meta name="keywords"/>
            </head>`))
    t.deepEqual(actual, [])
});

test('<head>: without <title> have an error', async t => {
    const actual = rule.preDefined.head.validate(
        cheerio.load(
            `<head>
            <meta name="descriptions"/>
            <meta name="keywords"/>
            </head>`))
    t.deepEqual(actual, ["This html without <title> tag"])
});

test('<head>: without <meta name="descriptions"/> have an error', async t => {
    const actual = rule.preDefined.head.validate(
        cheerio.load(
            `<head>
            <title></title>
            <meta name="keywords"/>
            </head>`))
    t.deepEqual(actual, [`This html without <meta name="descriptions"> tag`])
});

test('<head>: without <meta name="keywords"/> have an error', async t => {
    const actual = rule.preDefined.head.validate(
        cheerio.load(
            `<head>
            <title></title>
            <meta name="descriptions">            
            </head>`))
    t.deepEqual(actual, [`This html without <meta name="keywords"> tag`])
});
