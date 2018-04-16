const fs = require('fs');
const { Readable } = require('stream')
const cheerio = require('cheerio');
const { writeFileAsync, readFileAsync, getStreamContent, getReadableStream } = require('./utility')
const rule = require('./rule')

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

    async getReadableStream() {
        const results = await this._getExcuteResult();
        const rs = new Readable();
        rs._read = async () => {
            results.forEach(err => rs.push(err))
            rs.push(null);
        }
        return rs
    }

    async writeFile(filePath) {
        const results = await this._getExcuteResult();
        const data = results.join('\n');
        return writeFileAsync(filePath, data);
    }

    async _getExcuteResult() {
        const inputContent = await this._getInputContent(this.input);
        // this.logger.log("inputContent", inputContent);
        const $ = cheerio.load(inputContent);
        // this.logger.log($('body').text())        
        return this.rules.reduce((prev, { validate }) => {
            const errors = validate($);
            if (!Array.isArray(errors)) {
                this.logger.warn("rule.validate should return array")
                return prev;
            }
            return prev.concat(errors)
        }, []);
    }

    _getInputContent(input) {
        if (typeof input === 'string') {
            return readFileAsync(input);
        } else {
            return getStreamContent(input);
        }
    }
}

module.exports = { Detector, rule };