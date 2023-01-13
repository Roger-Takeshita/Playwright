const { test, expect } = require('@playwright/test');
const { newPageFromBrowser } = require('./_helpers');

const email = 'anshika@gmail.com';
const password = 'Iamking@000';
let customContext;

test.beforeAll(async ({ browser }) => {
    const filename = 'storageState.json';
    const { page, context } = await newPageFromBrowser(browser);
    await page.goto('https://rahulshettyacademy.com/client');

    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill(password);
    await page.locator('[value="Login"]').click();
    await page.waitForLoadState('networkidle');
    // Create a shareable file with all tokens / localStorage
    await context.storageState({ path: filename });
    // Create a new context using storageState
    customContext = await browser.newContext({ storageState: filename });
    await page.close();
});

test('API - Add Token To Storage State', async () => {
    const product1 = 'adidas original';
    const product2 = 'qwerty';
    const page = await customContext.newPage();
    await page.goto('https://rahulshettyacademy.com/client');

    const titles = await page.locator('.card-body b').allTextContents();
    const idx1 = titles.findIndex((title) => title.includes(product1));
    await page.locator('.card-body').nth(idx1).locator('text= Add To Cart').click();
    const idx2 = titles.findIndex((title) => title.includes(product2));
    await page.locator('.card-body').nth(idx2).locator('text= Add To Cart').click();
    await page.locator('[routerlink="/dashboard/cart"]').click();

    await page.locator('.cart li').last().waitFor();
    const exists = await page.locator(`h3:has-text('${product1}')`).isVisible();
    expect(exists).toBeTruthy();
    await page.close();
});
