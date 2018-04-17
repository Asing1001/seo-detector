const path = require('path');
const { Detector, preDefinedRule: {
    anchorShouldWithRel,
    imgShouldWithAlt,
    strongLimit,
    head,
    H1Limit1
} } = require('../');

const customRule = {
    validate: $ => {
        const errors = [];
        if (!$('foo').length) errors.push('custom rule error: <foo> not exist!')
        return errors;
    }
}
const streamDetector = new Detector({
    input: path.resolve(__dirname, 'example.html'),
    rules: [
        customRule,
        anchorShouldWithRel,
        imgShouldWithAlt,
        strongLimit(2),
        head,
        H1Limit1,
    ]
});

streamDetector.writeConsole().then(() => process.exit())


