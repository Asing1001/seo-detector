# seo-detector

## Pre-defined SEO rules

1. Detect if any `<img />` tag without alt attribute

1. Detect if any `<a />` tag without rel attribute

1. In `<head>` tag

    i. Detect if header doesn’t have `<title>` tag

    ii. Detect if header doesn’t have `<meta name=“descriptions” ... />` tag

    iii. Detect if header doesn’t have `<meta name=“keywords” ... />` tag

1. Detect if there’re more than 15 `<strong>` tag in HTML (15 is a value should be configurable by user)

1. Detect if a HTML have more than one `<H1>` tag.

## Development Requirement

1. This package should be production ready and a NPM module

1. User is free to chain any rules by themselves

    I. For example, they can only use the rule 1 and 4 or only use rule 2. 

    II. The order of rules is doesn’t matter

1. User can define and use their own rules easily

1. The input can be:

    I. A HTML file (User is able to config the input path)

    II. Node Readable Stream

1. The output can be:

    I. A file (User is able to config the output destination)

    II. Node Writable Stream

    III. Console

1. Your package should be flexible: 

    I. When we want to implement additional rules for `<meta>` tag, The code changes should be small. Ex: Checking `<meta name=“robots” />` existing or not?!
