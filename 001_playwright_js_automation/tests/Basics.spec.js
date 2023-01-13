const { test, expect } = require('@playwright/test');
const { log } = require('./_helpers');

test('Browser Context-Validating - Should Login', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise');

    await page.locator('#username').fill('rahulshettyacademy');
    await page.locator("[type='password']").type('learning');
    await page.locator('#signInBtn').click();
    await page.close();
});

test('Browser Context-Validating - Should Not Login', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise');

    await page.locator('#username').type('rahulshetty');
    await page.locator("[type='password']").type('learning');
    await page.locator('#signInBtn').click();
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');
    await page.close();
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
    await page.close();
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
    await page.close();
});

test('Browser Context-Validating - Should Return Array of Products, Wait HTML To Load', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise');

    await page.locator('#username').fill('rahulshettyacademy');
    await page.locator("[type='password']").fill('learning');

    // Wait until page change
    await Promise.all([page.locator('#signInBtn').click(), page.waitForNavigation()]);
    const titles = await page.locator('.card-body a').allTextContents();
    log(titles);
    await page.close();
});

test('UI Controls - Dropdown', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise');

    await page.locator('select.form-control').selectOption('consult');
    await page.close();
});

test('UI Controls - Radio Button - Should Pass', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise');

    const userRadio = page.locator('.radiotextsty').last();

    await page.locator('select.form-control').selectOption('consult');
    await userRadio.click();
    await page.locator('#okayBtn').click();
    await expect(userRadio).toBeChecked();
    const isChecked = await userRadio.isChecked();
    log(isChecked ? 'User Radio Is Checked' : 'User Radio Is NOT Checked');
    await page.close();
});

test('UI Controls - Radio Button - Should Fail', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise');

    const userRadio = page.locator('.radiotextsty').last();

    await expect(userRadio).not.toBeChecked();
    const isChecked = await userRadio.isChecked();
    log(isChecked ? 'User Radio Is Checked' : 'User Radio Is NOT Checked');
    await page.close();
});

test('UI Controls - Checkbox - Should Pass', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise');

    const userRadio = page.locator('.radiotextsty').last();
    const termsBox = page.locator('#terms');

    await page.locator('select.form-control').selectOption('consult');
    await userRadio.click();
    await page.locator('#okayBtn').click();
    await expect(userRadio).toBeChecked();
    await termsBox.click();
    await expect(termsBox).toBeChecked();
    await termsBox.uncheck();
    await expect(termsBox).not.toBeChecked();
    const isChecked = await termsBox.isChecked();
    expect(isChecked).toBeFalsy();
    await page.close();
});

test('UI Controls - Check Attribute Value - Should Pass', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise');

    const blinkingEl = page.locator('[href*="documents-request"]');
    await expect(blinkingEl).toHaveAttribute('class', 'blinkingText');
    await page.close();
});

test('UI Controls - Child Window/Tab - Should Pass', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise');

    const blinkingEl = page.locator('[href*="documents-request"]');
    const [_, newPage] = await Promise.all([blinkingEl.click(), context.waitForEvent('page')]);
    const text = await newPage.locator('.red').textContent();
    const domain = text.split('@')[1].split(' ')[0];
    await page.locator('#username').fill(domain);
    await page.close();
});
