const delay = (seconds) => {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
};

const RST = '\x1b[0m';
const FGGN = '\x1b[32m';
const FGWT = '\x1b[37m';
const BGGN = '\x1b[42m';

const log = (text, title) => {
    const newText = typeof text === 'string' ? text : JSON.stringify(text);
    console.log(`\n\t${BGGN}${FGWT} ${title ? toTitleCase(title) : 'Log'}: ${RST}\n\t${FGGN}${newText}${RST}\n`);
};

const toTitleCase = (str = '') => {
    const strArr = str.split(' ');

    return strArr
        .reduce((newStr, word) => {
            newStr = newStr + word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + ' ';
            return newStr;
        }, '')
        .trim();
};

const newPageFromBrowser = async (browser) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    return { page, context };
};

const newPageFromContext = async (context) => {
    const page = await context.newPage();
    return page;
};

module.exports = {
    delay,
    log,
    toTitleCase,
    newPageFromBrowser,
    newPageFromContext,
};
