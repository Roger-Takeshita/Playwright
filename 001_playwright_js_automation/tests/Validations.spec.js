const { test, expect } = require('@playwright/test');
const { newPageFromBrowser } = require('./_helpers');

test('Validations Test 1 - Dialog/Popup', async ({ browser }) => {
    const { page } = await newPageFromBrowser(browser);
    await page.goto('https://rahulshettyacademy.com/AutomationPractice');

    const inputEl = await page.locator('.displayed-class');
    await expect(inputEl).toBeVisible();
    await page.locator('#hide-textbox').click();
    await expect(inputEl).not.toBeVisible();
    await expect(inputEl).toBeHidden();

    page.on('dialog', (dialog) => dialog.accept());
    await page.locator('#confirmbtn').click();

    await page.close();
});

test('Validations Test 2 - Hover', async ({ browser }) => {
    const { page } = await newPageFromBrowser(browser);
    await page.goto('https://rahulshettyacademy.com/AutomationPractice');

    await page.locator('#mousehover').hover();
    await page.locator('[href="#top"]').click();

    await page.close();
});

test('Validations Test 3 - iFrame', async ({ browser }) => {
    const { page } = await newPageFromBrowser(browser);
    await page.goto('https://rahulshettyacademy.com/AutomationPractice');

    await page.keyboard.down('End');
    const framePage = await page.frameLocator('#courses-iframe');
    await framePage.locator('li a[href="lifetime-access"]:visible').click();
    const text = await framePage.locator('.text h2').textContent();
    const subscriberNumber = text.split(' ')[1].replace(',', '');
    expect(subscriberNumber).toBe('13522');

    await page.close();
});
