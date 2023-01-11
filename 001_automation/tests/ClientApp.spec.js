const { test, expect } = require('@playwright/test');
const { delay, log } = require('./_helpers');

test('Browser Context-Validating - Should Return Array of Products, Wait For API To Idle', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/client');

    await page.locator('#userEmail').fill('anshika@gmail.com');
    await page.locator('#userPassword').fill('Iamking@000');
    await page.locator('[value="Login"]').click();
    await page.waitForLoadState('networkidle');
    const titles = await page.locator('.card-body b').allTextContents();
    log(titles);
    await context.close();
    await browser.close();
});
