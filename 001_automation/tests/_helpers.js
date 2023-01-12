const { expect, request } = require('@playwright/test');

const delay = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
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

const newPageFromBrowser = async (browser, token) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    if (token) {
        await page.addInitScript((value) => {
            window.localStorage.setItem('token', value);
        }, token);
    }

    return { page, context };
};

const newPageFromContext = async (context) => {
    const page = await context.newPage();
    return page;
};

const getData = async (url, token) => {
    const options = {};
    const headers = {
        Authorization: token,
        'Application-Content': 'application/json',
    };

    if (token) options.headers = headers;

    const apiContext = await request.newContext();
    const response = await apiContext.get(url, options);
    if (!response.ok()) console.error({ response });
    expect(response.ok()).toBeTruthy();

    return response.json();
};

const postData = async (url, token, data) => {
    const options = {};
    const headers = {
        Authorization: token,
        'Application-Content': 'application/json',
    };

    if (token) options.headers = headers;
    if (data) options.data = data;

    const apiContext = await request.newContext();
    const response = await apiContext.post(url, options);
    if (!response.ok()) console.error({ response });
    expect(response.ok()).toBeTruthy();

    return response.json();
};

class Request {
    constructor(apiContext, email, password) {
        if (Request._instance) return Request._instance;
        Request._instance = this;

        this.apiContext = apiContext;
        this.email = email;
        this.password = password;
        this.userId;
        this.token;
        this.options;
    }

    async login() {
        const email = this.email || 'anshika@gmail.com';
        const password = this.password || 'Iamking@000';
        const url = 'https://rahulshettyacademy.com/api/ecom/auth/login';
        const data = {
            userEmail: email,
            userPassword: password,
        };

        const loginResponse = await this.apiContext.post(url, { data });
        const { token = '', userId = '' } = await loginResponse.json();

        this.token = token;
        this.userId = userId;
        this.options = {
            headers: {
                Authorization: token,
                'Application-Content': 'application/json',
            },
        };

        log(token, 'login token');

        return token;
    }

    async postData(url, data) {
        if (data) this.options.data = data;

        const response = await this.apiContext.post(url, this.options);
        return response.json();
    }

    async getData(url) {
        const response = await this.apiContext.get(url, this.options);
        return response.json();
    }
}

const waitForAnimationEnd = async (page, selector, ms = 500) => {
    const result = await page
        .locator(selector)
        .evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)));
    await delay(ms);

    return result;
};

module.exports = {
    Request,
    delay,
    getData,
    log,
    newPageFromBrowser,
    newPageFromContext,
    postData,
    toTitleCase,
    waitForAnimationEnd,
};
