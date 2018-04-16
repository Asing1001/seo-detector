const tagWithAttr = (tagName, attribute) => {
    return {
        validate: $ => {
            const tagWithoutAttr = $(`${tagName}:not([${attribute}])`);
            if (tagWithoutAttr.length > 0) {
                return `There are ${tagWithoutAttr.length} <${tagName}> tag without ${attribute} attribute`
            }
            return ""
        }
    }
}

const preDefined = {
    imgShouldWithAlt: tagWithAttr("img", "alt"),
    anchorShouldWithRel: tagWithAttr("a", "rel"),

}

module.exports = { tagWithAttr, tagWithAttr, preDefined }