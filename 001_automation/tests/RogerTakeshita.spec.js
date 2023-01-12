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
    await page.close();
});

test('Default context', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rogertakeshita.com');
    await page.close();
});

test('Default context - expect page title to be "Roger Takeshita"', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rogertakeshita.com');
    const pagetitle = await page.title();
    console.log(`page title = ${pagetitle}`);
    await expect(page).toHaveTitle('Roger Takeshita');
    await page.close();
});

test('Default context - submit contact form', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
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
    await page.close();
});

test('Gencode', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://www.rogertakeshita.com/');
    const page1Promise = page.waitForEvent('popup');
    await page.getByText('NPM - gh-pullProject InfoLive ProjectGitHub').click();
    const page1 = await page1Promise;
    const page2Promise = page1.waitForEvent('popup');
    await page1.getByRole('link', { name: 'Repository github.com/Roger-Takeshita/gh-pull' }).click();
    const page2 = await page2Promise;
    await page.getByPlaceholder('Your Name (Required)').click();
    await page.getByPlaceholder('Your Name (Required)').fill('roger@codegen.com');
    await page.getByPlaceholder('Your Name (Required)').press('Tab');
    await page.getByPlaceholder('Your Email (Required)').press('Shift+Tab');
    await page.getByPlaceholder('Your Name (Required)').press('Meta+x');
    await page.getByPlaceholder('Your Name (Required)').fill('Roger Test');
    await page.getByPlaceholder('Your Name (Required)').press('Tab');
    await page.getByPlaceholder('Your Email (Required)').fill('roger@codegen.com');
    await page.getByPlaceholder('Your Message...').click();
    await page.getByPlaceholder('Your Message...').fill('Testing from codegen');
    await page.getByRole('button', { name: 'Send' }).click();
    await page.close();
});
