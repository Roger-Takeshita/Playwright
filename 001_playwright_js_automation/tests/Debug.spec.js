const { test, expect, request } = require('@playwright/test');
const { newPageFromBrowser, Request } = require('./_helpers');

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const api = new Request(apiContext);
    await api.login();
});

test('API - Intercetp / Mock Block', async ({ browser }) => {
    const api = new Request();
    const { page } = await newPageFromBrowser(browser, api.token);

    const reqResURL = 'https://rahulshettyacademy.com/api/ecom/user/get-cart-count/620c7bf148767f1f1215d2ca';
    let requestFlag = false;
    let responseFlag = false;

    page.on('request', (req) => {
        const currentURL = req.url();

        if (currentURL === reqResURL && !requestFlag) {
            console.log({
                type: 'Request',
                url: currentURL,
            });
            requestFlag = true;
        }
    });

    page.on('response', (res) => {
        const currentURL = res.url();

        if (currentURL === reqResURL && !responseFlag) {
            console.log({
                type: 'Response',
                url: currentURL,
                status: res.status(),
            });
            responseFlag = true;
        }
    });

    await page.route('**/*.css', async (route) => {
        await route.abort();
    });

    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('button[routerlink="/dashboard/myorders"]').click();
    const orderId = await page.locator('tr.ng-star-inserted').first().locator('th').textContent();
    const url = `https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=${orderId}`;
    const mokedUrl = 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=63c05b26568c3e9fb1f64469';
    await page.route(url, (route) => {
        route.continue({ url: mokedUrl });
    });
    await page.locator('tr.ng-star-inserted').first().locator('button').first().click();
    const text = await page.locator('.blink_me').textContent();
    expect(text).toBe('You are not authorize to view this order');

    await page.close();
});
