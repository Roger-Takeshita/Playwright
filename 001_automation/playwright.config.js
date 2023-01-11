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
        // browserName: 'firefox',
        // browserName: 'webkit', // Safari
        headless: false,
        screenshot: 'on',
        trace: 'retain-on-failure',
    },
};

module.exports = config;
