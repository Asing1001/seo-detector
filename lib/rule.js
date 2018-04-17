const tagWithAttr = (tagName, attribute) => {
    return {
        validate: $ => {
            const err = [];
            const tagWithoutAttr = $(`${tagName}:not([${attribute}])`);
            if (tagWithoutAttr.length > 0) {
                err.push(`There are ${tagWithoutAttr.length} <${tagName}> tag without ${attribute} attribute`)
            }
            return err;
        }
    }
}

const preDefined = {
    imgShouldWithAlt: tagWithAttr("img", "alt"),
    anchorShouldWithRel: tagWithAttr("a", "rel"),
}

module.exports = { preDefined, tagWithAttr }