const { test, expect } = require('@playwright/test');
const { delay, log } = require('./_helpers');

test('Custom Playwright context', async ({ browser }) => {
    // New browser instance
    // We can pass some params to `newContext()`, eg: cookies / plugins
    const context = await browser.newContext();
    // New tab/page
    const page = await context.newPage();
    // Go to page
    await page.goto('https://rogertakeshita.com');
});

test('Default context', async ({ page }) => {
    await page.goto('https://rogertakeshita.com');
});

test('Default context - expect page title to be "Roger Takeshita"', async ({ page }) => {
    await page.goto('https://rogertakeshita.com');
    const pagetitle = await page.title();
    console.log(`page title = ${pagetitle}`);
    await expect(page).toHaveTitle('Roger Takeshita');
});

test('Default context - submit contact form', async ({ page }) => {
    const name = 'Roger Takeshita Test';
    await page.goto('https://rogertakeshita.com');
    await expect(page).toHaveTitle('Roger Takeshita');
    await page.locator('#name').fill(name);
    await page.locator('[placeholder="Your Email (Required)"]').fill('roger@fakeemail.com');
    await page.locator('[name="msg"]').fill('Hello from playwright course.');
    // await page.locator('button[type="submit"]').click();
    // const modal = await page.locator('.modal-msg--visible-true');
    // await expect(modal).toBeVisible();
    // await expect(await page.locator('.modal-msg__msg')).toContainText(
    //     `Thank you ${name} for you message, chat with you soon.`
    // );
    // await page.locator('.modal-msg__close').click();
});
