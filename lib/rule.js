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

const head = {
    validate: ($) => {
        const err = [];
        const $head = $('head');

        if ($head.length) {
            if (!$head.find('title').length) err.push("This html without <title> tag");
            if (!$head.find(`meta[name="descriptions"]`).length) err.push(`This html without <meta name="descriptions"> tag`)
            if (!$head.find(`meta[name="keywords"]`).length) err.push(`This html without <meta name="keywords"> tag`)
            // if (!$head.find(`meta[name="robots"]`).length) err.push(`This html without <meta name="robots"> tag`)         
        }
        return err;
    }
}

const preDefined = {
    head,
    imgShouldWithAlt: tagWithAttr("img", "alt"),
    anchorShouldWithRel: tagWithAttr("a", "rel"),
}

module.exports = { preDefined, tagWithAttr }