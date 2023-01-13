const { test, expect, request } = require('@playwright/test');
const { log, newPageFromBrowser, Request } = require('./_helpers');

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const api = new Request(apiContext);
    await api.login();
});

test('API - Intercept / Mock Response', async ({ browser }) => {
    const api = new Request();
    const url = `https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/${api.userId}`;
    const { page } = await newPageFromBrowser(browser, api.token);

    // Fetch orders
    // const response = await api.getData(url);
    // log(response, 'normal fetch');

    // Mock response
    // Needs to fake the response before makeing the api call
    await page.route(url, async (route) => {
        // Change our page into api request mode
        const response = await page.request.fetch(route.request());
        // Fufill promise
        const fakeData = {
            data: [],
            count: 0,
            message: 'No Orders',
        };
        route.fulfill({ response, body: JSON.stringify(fakeData) });
    });

    // Products page
    //    Brower makes the api call
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('button[routerlink="/dashboard/myorders"]').click();
    // Orders page
    await page.locator('button[routerlink="/dashboard"]').waitFor();
    const text = await page.locator('.mt-4.ng-star-inserted').textContent();
    expect(text).toContain('You have No Orders to show at this time.');

    await page.close();
});

test('API - Intercept / Mock Request', async ({ browser }) => {
    const api = new Request();
    const { page } = await newPageFromBrowser(browser, api.token);

    // Products page
    //    Brower makes the api call
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('button[routerlink="/dashboard/myorders"]').click();

    // Orders page
    // Get first orderId
    const orderId = await page.locator('tr.ng-star-inserted').first().locator('th').textContent();

    // Mock request
    const url = `https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=${orderId}`;
    const mokedUrl = 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=63c05b26568c3e9fb1f64469';

    log(url, 'original url');
    log(mokedUrl, 'mocked url');

    // We are overwriting the initial request url with mockedUrl
    await page.route(url, (route) => {
        route.continue({ url: mokedUrl });
    });

    await page.locator('tr.ng-star-inserted').first().locator('button').first().click();
    const text = await page.locator('.blink_me').textContent();
    expect(text).toBe('You are not authorize to view this order');

    await page.close();
});

test('API - Intercetp / Mock Block', async ({ browser }) => {
    const api = new Request();
    const { page } = await newPageFromBrowser(browser, api.token);

    // Block url from loading
    await page.route('**/*.css', async (route) => {
        await route.abort();
    });

    // Products page
    //    Brower makes the api call
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('button[routerlink="/dashboard/myorders"]').click();

    // Orders page
    // Get first orderId
    const orderId = await page.locator('tr.ng-star-inserted').first().locator('th').textContent();

    // Mock request
    const url = `https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=${orderId}`;
    const mokedUrl = 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=63c05b26568c3e9fb1f64469';

    log(url, 'original url');
    log(mokedUrl, 'mocked url');

    // We are overwriting the initial request url with mockedUrl
    await page.route(url, (route) => {
        route.continue({ url: mokedUrl });
    });

    await page.locator('tr.ng-star-inserted').first().locator('button').first().click();
    const text = await page.locator('.blink_me').textContent();
    expect(text).toBe('You are not authorize to view this order');

    await page.close();
});
