const fs = require('fs');
const cheerio = require('cheerio');
const { Readable } = require('stream')
const { writeFileAsync, readFileAsync, getStreamContent } = require('./utility')

class Detector {
    constructor({ input, rules, logger = console }) {
        if (!input) throw new Error("No input found")
        if (!rules || !rules.length) throw new Error("No rules found")
        this.input = input;
        this.rules = rules;
        this.logger = logger;
    }

    async writeConsole() {
        const results = await this._getExcuteResult();
        results.forEach(err => this.logger.log(err))
    }

    async _getExcuteResult() {
        const inputContent = await this._getInputContent(this.input);
        const $ = cheerio.load(inputContent);
        let results = [];
        this.rules.forEach(({ validate }) => {
            const errors = validate($);
            if (Array.isArray(errors)) {
                results = results.concat(errors)
            } else {
                this.logger.warn("rule.validate($) should return array")
            }
        });
        return results;
    }

    _getInputContent(input) {
        if (typeof input === 'string') {
            return readFileAsync(input);
        } else {
            return getStreamContent(input);
        }
    }

    async getReadableStream() {
        const results = await this._getExcuteResult();
        const rs = new Readable();
        results.forEach(err => rs.push(err))
        rs.push(null);
        return rs
    }

    async writeFile(filePath) {
        const results = await this._getExcuteResult();
        const data = results.join('\n');
        return writeFileAsync(filePath, data);
    }
}

module.exports = { Detector, preDefinedRule: require('./rule').preDefined };