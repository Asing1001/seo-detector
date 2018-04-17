# SEO detector

[![Coverage Status](https://coveralls.io/repos/github/Asing1001/seo-detector/badge.svg?branch=master)](https://coveralls.io/github/Asing1001/seo-detector?branch=master)

A Node.js package to detect HTML SEO defects

## Install

```bash
npm install seo-detector
```

## Example

```javascript
const path = require('path');
const { Detector } = require('seo-detector');

const fooExistRule = {
    validate: $ => {
        const errors = [];
        if (!$('foo').length) errors.push('This html does not contains <foo> tag!')
        return errors;
    }
}
const streamDetector = new Detector({
    input: path.resolve(__dirname, 'example.html'),
    rules: [ fooExistRule ]
});

streamDetector.writeConsole().then(() => process.exit())
```

It will out put following in console

```bash
custom rule error: <foo> not exist!
```

## Pre-defined SEO rules

1. Detect if any `<img />` tag without alt attribute
1. Detect if any `<a />` tag without rel attribute
1. In `<head>` tag
    - Detect if header doesn’t have `<title>` tag
    - Detect if header doesn’t have `<meta name=“descriptions” ... />` tag
    - Detect if header doesn’t have `<meta name=“keywords” ... />` tag
1. Detect if there’re more than 15 `<strong>` tag in HTML (15 is a value should be configurable by user)
1. Detect if a HTML have more than one `<H1>` tag.

### Use Pre-defined rules

```javascript
const { Detector, preDefinedRule: {
    anchorShouldWithRel,
    imgShouldWithAlt,
    strongLimit,
    head,
    H1Limit1
} } = require('seo-detector');

const detector = new Detector({
    input:'path/to/file.html',
    rules:[head, H1Limit1, imgShouldWithAlt, strongLimit(15)]
})

detector.writeConsole().then(() => process.exit())
```

## API Reference

### Constructor - `new Detector({input, rules ,logger?})`

- input : string | stream
- rules : Array<{validate: cheerioStatic => string[]}>
- logger : console-like object

### `.writeConsole()` : `Promise<void>`

Output result to console

### `.getReadableStream()` : `Promise<stream>`

Return a readable stream

### `.writeFile(filePath:string)` : `Promise<void>`

Output result to specific filepath

## Development

```bash
# Install dependencies
yarn install

# Test
yarn test

# See example
yarn example
```