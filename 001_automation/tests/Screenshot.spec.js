const { test, expect } = require('@playwright/test');
const { waitForAnimationEnd, newPageFromBrowser } = require('./_helpers');

const url = 'https://rahulshettyacademy.com/AutomationPractice';

test('Screenshot - Entire Page', async ({ browser }) => {
    const { page } = await newPageFromBrowser(browser);
    await page.goto(url);

    const inputEl = await page.locator('.displayed-class');
    await expect(inputEl).toBeVisible();
    await page.locator('#hide-textbox').click();
    await page.screenshot({ path: 'downloads/screenshot_entire_page.png' });
    await expect(inputEl).toBeHidden();

    await page.close();
});

test('Screenshot - Element Only', async ({ browser }) => {
    const { page } = await newPageFromBrowser(browser);
    await page.goto(url);

    const inputEl = await page.locator('.displayed-class');
    await expect(inputEl).toBeVisible();
    let idx = 0;
    const fieldTotal = await page.locator('fieldset').count();

    for (let i = 0; i < fieldTotal; i++) {
        const currentText = await page.locator('fieldset').nth(i).locator('legend').textContent();
        if (currentText === 'Element Displayed Example') {
            idx = i;
            await page.locator('fieldset').nth(i).screenshot({ path: 'downloads/screenshot_visible.png' });
            break;
        }
    }

    await page.locator('#hide-textbox').click();
    await page.locator('fieldset').nth(idx).screenshot({ path: 'downloads/screenshot_hidden.png' });

    await expect(inputEl).toBeHidden();

    await page.close();
});

test.only('Screenshot - Compare Snapshot', async ({ browser }) => {
    const { page } = await newPageFromBrowser(browser);
    await page.goto('https://rogertakeshita.com');

    // await page.waitForLoadState('networkidle');
    await waitForAnimationEnd(page, '.heading-primary__text-title-1');
    const currentScreenshot = await page.screenshot();
    expect(currentScreenshot).toMatchSnapshot('original_rogertakeshita.png');

    await page.close();
});
