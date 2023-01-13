// @ts-check
const { devices } = require('@playwright/test');

const config = {
    testDir: './tests',
    timeout: 30 * 1000,
    expect: {
        timeout: 5000,
    },
    reporter: 'html',
    projects: [
        {
            name: 'Chrome',
            use: {
                browserName: 'chromium',
                headless: true,
                screenshot: 'on',
                video: 'retain-on-failure',
                trace: 'retain-on-failure',
            },
        },
        {
            name: 'Firefox',
            use: {
                browserName: 'firefox',
                headless: false,
                screenshot: 'off',
                trace: 'off',
                viewport: {
                    width: 1920,
                    height: 1080,
                },
            },
        },
        {
            name: 'Safair',
            use: {
                browserName: 'webkit',
                headless: false,
                screenshot: 'on',
                trace: 'retain-on-failure',
            },
        },
        {
            name: 'iPhone',
            use: {
                browserName: 'webkit',
                headless: false,
                screenshot: 'on',
                trace: 'retain-on-failure',
                ...devices['iPhone 11'],
            },
        },
        {
            name: 'ignoreHttpsErrors',
            use: {
                browserName: 'webkit',
                headless: false,
                screenshot: 'on',
                trace: 'retain-on-failure',
                ignoreHttpsErros: true,
            },
        },
        {
            name: 'differentPermission',
            use: {
                browserName: 'webkit',
                headless: false,
                screenshot: 'on',
                trace: 'retain-on-failure',
                permissions: ['geolocation', 'notifications'],
            },
        },
    ],
};

module.exports = config;
