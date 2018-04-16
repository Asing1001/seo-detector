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
        const $ = await this._getCheerio$();
        this.rules.map(({ validate }) => this.logger.log(validate($)))
    }

    async getReadableStream() {
        const $ = await this._getCheerio$();
        const rs = new Readable();
        rs._read = async () => {
            this.rules.map(({ validate }) => rs.push(validate($)))
            rs.push(null);
        }
        return rs
    }

    writeFile(filePath) {
        const $ = this._getCheerio$();
        const data = this.rules.map(({ validate }) => validate($));
        return writeFileAsync(filePath, data);
    }

    async _getCheerio$() {
        const inputContent = await this._getInputContent(this.input);
        // this.logger.log("inputContent", inputContent);
        const $ = cheerio.load(inputContent);
        // this.logger.log($('body').text())
        return $;
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