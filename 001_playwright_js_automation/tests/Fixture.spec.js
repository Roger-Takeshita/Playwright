const { test, expect, request } = require('@playwright/test');
const { newPageFromBrowser, Request } = require('./_helpers');
const usersData = require('../fixtures/placeholder.json');
const { customTest } = require('./customTest');

const users = JSON.parse(JSON.stringify(usersData));

for (const user of users) {
    test(`Import Parameters / Data - ${user.email}`, async ({ browser }) => {
        const apiContext = await request.newContext();
        const req = new Request(apiContext, user.email, user.password);
        const token = await req.login();

        const { page } = await newPageFromBrowser(browser, token);

        // Products Page
        await page.goto('https://rahulshettyacademy.com/client');
        await page.waitForLoadState('networkidle');
        const titles = await page.locator('.card-body b').allTextContents();
        const idx1 = titles.findIndex((title) => title.includes(user.productName));
        await page.locator('.card-body').nth(idx1).locator('text= Add To Cart').click();
        await page.locator('[routerlink="/dashboard/cart"]').click();
        await page.locator('.cart li').last().waitFor();
        const exists = await page.locator(`h3:has-text('${user.productName}')`).isVisible();
        expect(exists).toBeTruthy();
        await page.locator('button[type="button"]').nth(1).locator('text=Checkout').click();
        // Checkout Page
        await page.locator('.row input').nth(0).fill('4242424242424242');
        await page.locator('.row input').nth(1).fill('123');
        await page.locator('.row input').nth(2).fill('Roger Takeshita');
        await page.locator('.row input[name="coupon"]').fill('DiscountCode');
        await page.locator('.row input').nth(4).fill(user.email);
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
}

customTest('Fixture Custom Test', async ({ browser, user }) => {
    const apiContext = await request.newContext();
    const req = new Request(apiContext, user.email, user.password);
    const token = await req.login();

    const { page } = await newPageFromBrowser(browser, token);

    // Products Page
    await page.goto('https://rahulshettyacademy.com/client');
    await page.waitForLoadState('networkidle');
    const titles = await page.locator('.card-body b').allTextContents();
    const idx1 = titles.findIndex((title) => title.includes(user.productName));
    await page.locator('.card-body').nth(idx1).locator('text= Add To Cart').click();
    await page.locator('[routerlink="/dashboard/cart"]').click();
    await page.locator('.cart li').last().waitFor();
    const exists = await page.locator(`h3:has-text('${user.productName}')`).isVisible();
    expect(exists).toBeTruthy();
    await page.locator('button[type="button"]').nth(1).locator('text=Checkout').click();
    // Checkout Page
    await page.locator('.row input').nth(0).fill('4242424242424242');
    await page.locator('.row input').nth(1).fill('123');
    await page.locator('.row input').nth(2).fill('Roger Takeshita');
    await page.locator('.row input[name="coupon"]').fill('DiscountCode');
    await page.locator('.row input').nth(4).fill(user.email);
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
