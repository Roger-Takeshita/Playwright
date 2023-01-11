// @ts-check
const { devices } = require('@playwright/test');

const config = {
    testDir: './tests',
    timeout: 30 * 1000,
    expect: {
        timeout: 5000,
    },
    reporter: 'html',
    use: {
        browserName: 'chromium',
        headless: false,
        // browserName: 'firefox',
        // browserName: 'webkit', // Safari
    },
};

module.exports = config;
