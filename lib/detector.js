const fs = require('fs');
const cheerio = require('cheerio');
const { readFileAsync, getStreamContent } = require('./input')

class detector {

    constructor({ input, rules }) {
        this.props = { input, rules }
    }

    async writeConsole() {
        const results = await this.excute()
        results.forEach(result=>console.log(result));
    }

    async excute() {
        const inputContent = await this.getInputContent(this.props.input);
        const $ = cheerio.load(inputContent);
        return this.props.rules.map(({ validate }) => validate($));
    }    

    getInputContent(input) {
        if (typeof input === 'string') {
            return readFileAsync(input);
        } else {
            return getStreamContent(input);
        }
    }    
}

module.exports = detector;