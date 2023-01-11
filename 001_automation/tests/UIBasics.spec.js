const { test, expect } = require('@playwright/test');
const { delay, log } = require('./_helpers');

test('Browser Context-Validating - Should Login', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise');

    await page.locator('#username').fill('rahulshettyacademy');
    await page.locator("[type='password']").type('learning');
    await page.locator('#signInBtn').click();
});

test('Browser Context-Validating - Should Not Login', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise');

    await page.locator('#username').type('rahulshetty');
    await page.locator("[type='password']").type('learning');
    await page.locator('#signInBtn').click();
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');
});

test('Browser Context-Validating - Should Login After Fixing Form', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const usernameInput = page.locator('#username');
    const signinBtn = page.locator('#signInBtn');
    await page.goto('https://rahulshettyacademy.com/loginpagePractise');
    log(await page.title());

    await usernameInput.type('rahulshetty');
    await page.locator("[type='password']").type('learning');
    await signinBtn.click();
    log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');
    await usernameInput.fill('rahulshettyacademy');
    await signinBtn.click();
});

test('Browser Context-Validating - Should Return First Product', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise');

    await page.locator('#username').fill('rahulshettyacademy');
    await page.locator("[type='password']").fill('learning');
    await page.locator('#signInBtn').click();

    const firstProductOption1 = await page.locator('.card-body a').first().textContent();
    const firstProductOption2 = await page.locator('.card-body a').nth(0).textContent();

    log(firstProductOption1, 'option 1');
    log(firstProductOption2, 'option 2');

    const cards = page.locator('.card-body a');

    log(await cards.nth(0).textContent());
    log(await cards.nth(1).textContent());
    log(await cards.nth(2).textContent());
});

test('Browser Context-Validating - Should Return Array of Products, Wait HTML To Load', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise');

    await page.locator('#username').fill('rahulshettyacademy');
    await page.locator("[type='password']").fill('learning');

    // Wait until page change
    await Promise.all([page.waitForNavigation(), page.locator('#signInBtn').click()]);
    const titles = await page.locator('.card-body a').allTextContents();
    log(titles);
});
