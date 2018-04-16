const imgWithAlt = {
    validate: $ => {
        const imgWithOutAlt = $('img:not([alt])');
        if (imgWithOutAlt.length > 0) {
            return `There are ${imgWithOutAlt.length} <img> tag without alt attribute`
        }
        return ""
    }
}
module.exports = { imgWithAlt }