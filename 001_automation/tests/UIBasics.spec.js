import { test } from '@playwright/test';

describe('Playwright Basics', () => {
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
});
