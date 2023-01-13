const { test, expect, request } = require('@playwright/test');
const { newPageFromBrowser, postData, Request } = require('./_helpers');

const email = 'anshika@gmail.com';
let token;

test.describe.configure({ mode: 'parallel' });

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const api = new Request(apiContext);
    token = await api.login();
});

test('API - Authenticate', async ({ browser }) => {
    const { page } = await newPageFromBrowser(browser, token);

    // Products Page
    const product1 = 'adidas original';
    await page.goto('https://rahulshettyacademy.com/client');
    await page.waitForLoadState('networkidle');
    const titles = await page.locator('.card-body b').allTextContents();
    const idx1 = titles.findIndex((title) => title.includes(product1));
    await page.locator('.card-body').nth(idx1).locator('text= Add To Cart').click();
    await page.locator('[routerlink="/dashboard/cart"]').click();
    await page.locator('.cart li').last().waitFor();
    const exists = await page.locator(`h3:has-text('${product1}')`).isVisible();
    expect(exists).toBeTruthy();
    await page.locator('button[type="button"]').nth(1).locator('text=Checkout').click();
    // Checkout Page
    await page.locator('.row input').nth(0).fill('4242424242424242');
    await page.locator('.row input').nth(1).fill('123');
    await page.locator('.row input').nth(2).fill('Roger Takeshita');
    await page.locator('.row input[name="coupon"]').fill('DiscountCode');
    await page.locator('.row input').nth(4).fill(email);
    await page.locator('.row input').nth(5).type('canada');
    await page.locator('.ta-item.list-group-item').click();
    await page.locator('.input.ddl').nth(0).click();
    await page.locator('.input.ddl').nth(0).selectOption({ index: 5 });
    await page.locator('.input.ddl').nth(1).click();
    await page.locator('.input.ddl').nth(1).selectOption({ index: 22 });
    await page.locator('.action__submit').click();
    // Confirmation Page
    const successMsg = await page.locator('.hero-primary');
    await expect(successMsg).toHaveText('Thankyou for the order.');
    const orderIds = await page.locator('.em-spacer-1 .ng-star-inserted').allTextContents();
    const ids = orderIds.map((id) => id.replace(/\s+\|\s+/g, ''));
    await page.locator('button[routerlink="/dashboard/myorders"]').click();
    // Orders Page
    await page.locator('.table').waitFor();
    const total = await page.locator('tr.ng-star-inserted').count();
    for (let i = 0; i < total; i++) {
        const currentId = await page.locator('tr.ng-star-inserted').nth(i).locator('th').textContent();

        if (ids.includes(currentId)) {
            await page.locator('tr.ng-star-inserted').nth(i).locator('button').first().click();
            // Order Item Page
            const text = await page.locator('div.col-text').textContent();
            expect(text).toBe(currentId);
            await page.locator('button[routerlink="/dashboard/myorders"]').click();
        }
    }

    await page.close();
});

test('API - Verify Order', async ({ browser }) => {
    const { page } = await newPageFromBrowser(browser, token);

    const orderUrl = 'https://rahulshettyacademy.com/api/ecom/order/create-order';
    const orderData = {
        orders: [
            {
                country: 'Canada',
                productOrderedId: '6262e95ae26b7e1a10e89bf0',
            },
        ],
    };
    const submitResponse = await postData(orderUrl, token, orderData);
    const ids = submitResponse.orders;

    // Products Page
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('button[routerlink="/dashboard/myorders"]').click();
    // Orders Page
    await page.locator('.table').waitFor();
    const total = await page.locator('tr.ng-star-inserted').count();
    for (let i = 0; i < total; i++) {
        const currentId = await page.locator('tr.ng-star-inserted').nth(i).locator('th').textContent();

        if (ids.includes(currentId)) {
            await page.locator('tr.ng-star-inserted').nth(i).locator('button').first().click();
            // Order Item Page
            const text = await page.locator('div.col-text').textContent();
            expect(text).toBe(currentId);
            await page.locator('button[routerlink="/dashboard/myorders"]').click();
        }
    }

    await page.close();
});

test('API - Verify Order2', async ({ browser }) => {
    const api = new Request();
    const { page } = await newPageFromBrowser(browser, api.token);

    const url = 'https://rahulshettyacademy.com/api/ecom/order/create-order';
    const data = {
        orders: [
            {
                country: 'Canada',
                productOrderedId: '6262e95ae26b7e1a10e89bf0',
            },
        ],
    };

    const submitResponse = await api.postData(url, data);
    const ids = submitResponse.orders;

    // Products Page
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('button[routerlink="/dashboard/myorders"]').click();
    // Orders Page
    await page.locator('.table').waitFor();
    const total = await page.locator('tr.ng-star-inserted').count();
    for (let i = 0; i < total; i++) {
        const currentId = await page.locator('tr.ng-star-inserted').nth(i).locator('th').textContent();

        if (ids.includes(currentId)) {
            await page.locator('tr.ng-star-inserted').nth(i).locator('button').first().click();
            // Order Item Page
            const text = await page.locator('div.col-text').textContent();
            expect(text).toBe(currentId);
            await page.locator('button[routerlink="/dashboard/myorders"]').click();
        }
    }

    await page.close();
});
