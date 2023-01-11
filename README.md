<h1 id='table-of-contents'>Table of Contents</h1>

- [PLAYWRIGHT](#playwright)
  - [Links](#links)
  - [Init Playwright](#init-playwright)
  - [Globally Available](#globally-available)
  - [Base Config](#base-config)
  - [Run tests](#run-tests)
  - [Docs](#docs)
    - [Assertions](#assertions)
    - [Selectors](#selectors)
      - [CSS](#css)
    - [Wait API / HTML](#wait-api--html)
      - [Wait For API To Idle](#wait-for-api-to-idle)
      - [Wait For HTML To Load](#wait-for-html-to-load)

---

# PLAYWRIGHT

## Links

- [Playwright Docs](https://playwright.dev/docs/intro)
- [Auto-waiting](https://playwright.dev/docs/actionability)

## Init Playwright

Init `Playwright`

```Bash
npm init playwright
```

## Globally Available

In `Playwright` we have some globally available fixtures, like:

- `browser`
- `page`

```JavaScript
import { test } from '@playwright/test';

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
```

## Base Config

In `001_automation/playwright.config.js`

```JavaScript
// @ts-check
const { devices } = require('@playwright/test');

const config = {
    testDir: './tests',
    timeout: 30 * 1000,
    expect: {
        timeout: 5000,
    },
    reporter: 'html',
    use: {
        browserName: 'chromium',
        headless: false,
        // browserName: 'firefox',
        // browserName: 'webkit', // Safari
    },
};

module.exports = config;
```

## Run tests

```Bash
npx playwright test
npx playwright test --project=chromium
npx playwright test --debug
npx playwright test --headed
npx playwright test --headed --debug
```

## Docs

### Assertions

- [Playwright Assertions](https://playwright.dev/docs/test-assertions)

To test our page expectations, we need to import `expect` from `@playwright/test`

```JavaScript
const { test, expect } = require('@playwright/test');

test('default context - expect page title to be Roger Takeshita', async ({ page }) => {
    await page.goto('https://rogertakeshita.com');
    const pageTitle = await page.title();
    console.log(`page title = ${pageTitle}`);
    await expect(page).toHaveTitle('roger takeshita');
});
```

### Selectors

#### CSS

```JavaScript
await page.locator('#name');
```

- Id

  `#name` or `input#name`

- CSS Class

  `.form__input` or `input.form__input`

- Attribute

  `[name="name"]` or `input[name="name"]`

```JavaScript
test('Default context - submit contact form', async ({ page }) => {
    const name = 'Roger Takeshita Test';
    await page.goto('https://rogertakeshita.com');
    await expect(page).toHaveTitle('Roger Takeshita');
    await page.locator('#name').fill(name);
    await page.locator('[placeholder="Your Email (Required)"]').fill('roger@fakeemail.com');
    await page.locator('[name="msg"]').fill('Hello from playwright course.');
    await page.locator('button[type="submit"]').click();
    const modal = await page.locator('.modal-msg--visible-true');
    await expect(modal).toBeVisible();
    await expect(await page.locator('.modal-msg__msg')).toContainText(
        `Thank you ${name} for you message, chat with you soon.`
    );
    await page.locator('.modal-msg__close').click();
});
```

### Wait API / HTML

#### Wait For API To Idle

```JavaScript
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
});
```

#### Wait For HTML To Load

```JavaScript
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
```
