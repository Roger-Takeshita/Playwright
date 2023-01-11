const { test, expect } = require('@playwright/test');
const { delay, log, newPageFromBrowser } = require('./_helpers');

const email = 'anshika@gmail.com';
const password = 'Iamking@000';

test('Browser Context-Validating - Should Return Array of Products, Wait For API To Idle', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/client');

    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill(password);
    await page.locator('[value="Login"]').click();
    await page.waitForLoadState('networkidle');
    const titles = await page.locator('.card-body b').allTextContents();
    log(titles);
    await context.close();
});

test('E2E - Test 1', async ({ browser }) => {
    const product1 = 'adidas original';
    const product2 = 'qwerty';
    const { page, context } = await newPageFromBrowser(browser);
    await page.goto('https://rahulshettyacademy.com/client');

    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill(password);
    await page.locator('[value="Login"]').click();
    await page.waitForLoadState('networkidle');
    const titles = await page.locator('.card-body b').allTextContents();
    const idx1 = titles.findIndex((title) => title.includes(product1));
    await page.locator('.card-body').nth(idx1).locator('text= Add To Cart').click();
    const idx2 = titles.findIndex((title) => title.includes(product2));
    await page.locator('.card-body').nth(idx2).locator('text= Add To Cart').click();
    await page.locator('[routerlink="/dashboard/cart"]').click();

    await page.locator('.cart li').last().waitFor();
    const exists = await page.locator(`h3:has-text('${product1}')`).isVisible();
    await expect(exists).toBeTruthy();
    await context.close();
});

test('E2E - Test 2', async ({ browser }) => {
    const product1 = 'adidas original';
    const { page, context } = await newPageFromBrowser(browser);
    await page.goto('https://rahulshettyacademy.com/client');

    // Login
    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill(password);
    await page.locator('[value="Login"]').click();
    // Products Page
    await page.waitForLoadState('networkidle');
    const titles = await page.locator('.card-body b').allTextContents();
    const idx1 = titles.findIndex((title) => title.includes(product1));
    await page.locator('.card-body').nth(idx1).locator('text= Add To Cart').click();
    await page.locator('[routerlink="/dashboard/cart"]').click();
    await page.locator('.cart li').last().waitFor();
    const exists = await page.locator(`h3:has-text('${product1}')`).isVisible();
    await expect(exists).toBeTruthy();
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

    await context.close();
});
