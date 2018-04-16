const cheerio = require('cheerio');
const { test } = require('ava');
const { rule } = require("../");

test('tagWithAttr', async t => {
    const tagShouldWithAttribute = rule.tagWithAttr('tagName', 'attributeName');
    const actual = tagShouldWithAttribute.validate(
        cheerio.load(
            `<tagName foo /> <tagName bar />`));
    t.true(actual === `There are 2 <tagName> tag without attributeName attribute`)
});

test('imgShouldWithAlt', async t => {
    const actual = rule.preDefined.imgShouldWithAlt.validate(
        cheerio.load(
            `<img src="foo" alt="alt" /> <img src="foo" />`));
    t.true(actual === `There are 1 <img> tag without alt attribute`)
});

test('anchorShouldWithRel', async t => {
    const actual = rule.preDefined.anchorShouldWithRel.validate(
        cheerio.load(
            `<a rel="url" /> <a />`))
    t.true(actual === `There are 1 <a> tag without rel attribute`)
});
