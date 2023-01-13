const playwright = require('@playwright/test');

exports.customTest = playwright.test.extend({
    user: {
        email: 'fakeaccount@getnada.com',
        password: 'superfake1B',
        productName: 'adidas original',
    },
});
