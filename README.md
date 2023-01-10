# PLAYWRIGHT

## Links

- [Playwright Docs](https://playwright.dev/docs/intro)

## Init Playwright

Init `Playwright`

```Bash
npm init playwright
```

## Docs

### Globally Available

In `Playwright` we have some globally available fixtures, like:

- `browser`
- `page`

```JavaScript
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

```
