<h1 id='table-of-contents'>Table of Contents</h1>

- [PLAYWRIGHT](#playwright)
  - [Links](#links)
  - [Init Playwright](#init-playwright)
  - [Globally Available](#globally-available)
  - [Base Config](#base-config)
  - [Run tests](#run-tests)
  - [Docs](#docs)
    - [Inspector / Pause](#inspector--pause)
    - [Auto-waiting](#auto-waiting)
    - [Locators](#locators)
      - [Chaining](#chaining)
    - [Selectors](#selectors)
      - [CSS Selectors](#css-selectors)
      - [Dropdown](#dropdown)
      - [Radio Button](#radio-button)
      - [Checkbox](#checkbox)
      - [Check If an Element Has an Attribute](#check-if-an-element-has-an-attribute)
      - [Text](#text)
      - [Tag Name (`has-text`)](#tag-name-has-text)
    - [Wait API / HTML](#wait-api--html)
      - [Wait For API To Idle](#wait-for-api-to-idle)
      - [Wait For HTML To Load](#wait-for-html-to-load)
      - [Wait For Element To Load](#wait-for-element-to-load)
    - [Assertions](#assertions)
      - [List of Assertions](#list-of-assertions)
      - [Negating Matchers](#negating-matchers)
      - [Soft Assertions](#soft-assertions)
      - [Custom Expect Message](#custom-expect-message)
      - [Polling](#polling)
      - [Retrying](#retrying)
    - [Child Window/Tab](#child-windowtab)
    - [Codegen](#codegen)
    - [Traces](#traces)

---

# PLAYWRIGHT

## Links

- [Docs](https://playwright.dev/docs/intro)
- [Api Testing](https://playwright.dev/docs/test-api-testing)
- [Assertions](https://playwright.dev/docs/test-assertions)
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
    await context.close();
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

---

### Inspector / Pause

```JavaScript
await page.pause();
```

This command will pause the `Playwright` execution. Like a debugger breakpoint

---

### Auto-waiting

- [Auto-waiting](https://playwright.dev/docs/actionability)

| Action                 | Attached | Visible | Stable | Receives Events | Enabled | Editable |
| ---------------------- | -------- | ------- | ------ | --------------- | ------- | -------- |
| check                  | Yes      | Yes     | Yes    | Yes             | Yes     | -        |
| click                  | Yes      | Yes     | Yes    | Yes             | Yes     | -        |
| dblclick               | Yes      | Yes     | Yes    | Yes             | Yes     | -        |
| setChecked             | Yes      | Yes     | Yes    | Yes             | Yes     | -        |
| tap                    | Yes      | Yes     | Yes    | Yes             | Yes     | -        |
| uncheck                | Yes      | Yes     | Yes    | Yes             | Yes     | -        |
| hover                  | Yes      | Yes     | Yes    | Yes             | -       | -        |
| scrollIntoViewIfNeeded | Yes      | -       | Yes    | -               | -       | -        |
| screenshot             | Yes      | Yes     | Yes    | -               | -       | -        |
| fill                   | Yes      | Yes     | -      | -               | Yes     | Yes      |
| selectText             | Yes      | Yes     | -      | -               | -       | -        |
| dispatchEvent          | Yes      | -       | -      | -               | -       | -        |
| focus                  | Yes      | -       | -      | -               | -       | -        |
| getAttribute           | Yes      | -       | -      | -               | -       | -        |
| innerText              | Yes      | -       | -      | -               | -       | -        |
| innerHTML              | Yes      | -       | -      | -               | -       | -        |
| press                  | Yes      | -       | -      | -               | -       | -        |
| setInputFiles          | Yes      | -       | -      | -               | -       | -        |
| selectOption           | Yes      | Yes     | -      | -               | Yes     | -        |
| textContent            | Yes      | -       | -      | -               | -       | -        |
| type                   | Yes      | -       | -      | -               | -       | -        |

`Playwright` performs a range of actionability checks on the elements before making actions to ensure these actions behave as expected. It auto-waits for all the relevant checks to pass and only then performs the requested action. If the required checks do not pass within the given `timeout`, action fails with the `TimeoutError`.

For example, for [page.click()](https://playwright.dev/docs/api/class-page#page-click), `Playwright` will ensure that:

- element is `Attached` to the DOM
- element is `Visible`
- element is `Stable`, as in not animating or completed animation
- element `Receives Events`, as in not obscured by other elements
- element is `Enabled`

Here is the complete list of actionability checks performed for each action:

- **Forcing actions**

  Some actions like [page.click()](https://playwright.dev/docs/api/class-page#page-click) support `force` option that disables non-essential actionability checks, for example passing truthy `force` to [page.click()](https://playwright.dev/docs/api/class-page#page-click) method will not check that the target element actually receives click events.

- **Assertions**

  You can check the actionability state of the element using one of the following methods as well. This is typically not necessary, but it helps writing assertive tests that ensure that after certain actions, elements reach actionable state:

  - [elementHandle.isChecked()](https://playwright.dev/docs/api/class-elementhandle#element-handle-is-checked)
  - [elementHandle.isDisabled()](https://playwright.dev/docs/api/class-elementhandle#element-handle-is-disabled)
  - [elementHandle.isEditable()](https://playwright.dev/docs/api/class-elementhandle#element-handle-is-editable)
  - [elementHandle.isEnabled()](https://playwright.dev/docs/api/class-elementhandle#element-handle-is-enabled)
  - [elementHandle.isHidden()](https://playwright.dev/docs/api/class-elementhandle#element-handle-is-hidden)
  - [elementHandle.isVisible()](https://playwright.dev/docs/api/class-elementhandle#element-handle-is-visible)
  - [page.isChecked()](https://playwright.dev/docs/api/class-page#page-is-checked)
  - [page.isDisabled()](https://playwright.dev/docs/api/class-page#page-is-disabled)
  - [page.isEditable()](https://playwright.dev/docs/api/class-page#page-is-editable)
  - [page.isEnabled()](https://playwright.dev/docs/api/class-page#page-is-enabled)
  - [page.isHidden()](https://playwright.dev/docs/api/class-page#page-is-hidden)
  - [page.isVisible()](https://playwright.dev/docs/api/class-page#page-is-visible)
  - [locator.isChecked()](https://playwright.dev/docs/api/class-locator#locator-is-checked)
  - [locator.isDisabled()](https://playwright.dev/docs/api/class-locator#locator-is-disabled)
  - [locator.isEditable()](https://playwright.dev/docs/api/class-locator#locator-is-editable)
  - [locator.isEnabled()](https://playwright.dev/docs/api/class-locator#locator-is-enabled)
  - [locator.isHidden()](https://playwright.dev/docs/api/class-locator#locator-is-hidden)
  - [locator.isVisible()](https://playwright.dev/docs/api/class-locator#locator-is-visible)

- **Attached**

  Element is considered attached when it is [connected](https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected) to a Document or a ShadowRoot.

- **Visible**

  Element is considered visible when it has non-empty bounding box and does not have `visibility:hidden` computed style. Note that elements of zero size or with `display:none` are not considered visible.

- **Stable**

  Element is considered stable when it has maintained the same bounding box for at least two consecutive animation frames.

- **Enabled**

  Element is considered enabled unless it is a `<button>`, `<select>`, `<input>` or `<textarea>` with a `disabled` property.

- **Editable**

  Element is considered editable when it is `enabled` and does not have `readonly` property set.

- **Receives Events**

  Element is considered receiving pointer events when it is the hit target of the pointer event at the action point. For example, when clicking at the point `(10;10)`, `Playwright` checks whether some other element (usually an overlay) will instead capture the click at `(10;10)`.

  For example, consider a scenario where `Playwright` will click `Sign Up` button regardless of when the [page.click()](https://playwright.dev/docs/api/class-page#page-click) call was made:

  - page is checking that user name is unique and `Sign Up` button is disabled;
  - after checking with the server, the disabled `Sign Up` button is replaced with another one that is now enabled.

- **Assertions**

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

---

### Locators

#### Chaining

```JavaScript
await page.locator('button[type="button"]').nth(1).locator('text=Checkout').click();
//                             ^              ^                  ^             ^
//                             |              |                  |             └── Action
//                             |              |                  └── Text attribute
//                             |              └── Return second item
//                             └── Return an array of buttons
```

### Selectors

```JavaScript
await page.locator('#name');
```

- Id

  `#name` or `input#name`

- CSS Class

  `.form__input` or `input.form__input`

- Attribute

  `[name="name"]` or `input[name="name"]`

#### CSS Selectors

- CSS Ids, Tags, Elements, Attributes

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

#### Dropdown

```JavaScript
test('UI Controls - Dropdown', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise');

    await page.locator('select.form-control').selectOption('consult');
    await context.close();
});
```

#### Radio Button

```JavaScript
test.only('UI Controls - Radio Button - Should Pass', async ({ browser }) => {
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
    await context.close();
});
```

#### Checkbox

```JavaScript
test.only('UI Controls - Checkbox - Should Pass', async ({ browser }) => {
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
    await expect(isChecked).toBeFalsy();
    await context.close();
});
```

#### Check If an Element Has an Attribute

```JavaScript
test.only('UI Controls - Check Attribute Value - Should Pass', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise');

    const blinkingEl = page.locator('[href*="documents-request"]');
    await expect(blinkingEl).toHaveAttribute('class', 'blinkingText');
    await context.close();
});
```

#### Text

```JavaScript
test.only('E2E - Test 1', async ({ browser }) => {
    const item = 'adidas original';
    const { page, context } = await newPageFromBrowser(browser);
    await page.goto('https://rahulshettyacademy.com/client');

    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill(password);
    await page.locator('[value="Login"]').click();
    await page.waitForLoadState('networkidle');
    const titles = await page.locator('.card-body b').allTextContents();
    const idx = titles.findIndex((title) => title.includes(item));
    await page.locator('.card-body').nth(idx).locator('text= Add To Cart').click();
    await page.pause();
    await context.close();
});
```

```JavaScript
const titles = await page.locator('.card-body b').allTextContents();
const idx = titles.findIndex((title) => title.includes(item));
await page.locator('.card-body').nth(idx).locator('text= Add To Cart').click();
```

```JavaScript
const successMsg = await page.locator('.hero-primary');
await expect(successMsg).toHaveText('Thankyou for the order.');
```

#### Tag Name (`has-text`)

```JavaScript
test.only('E2E - Test 1', async ({ browser }) => {
    const product1 = 'adidas original';
    const product2 = 'qwerty';
    const { page, context } = await newPageFromBrowser(browser);
    await page.goto('https://rahulshettyacademy.com/client');

    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill(password);
    await page.locator('[value="Login"]').click();
    await page.waitForLoadState('networkidle');
    const titles = await page.locator('.card-body b').allTextContents();

    const idx1 = titles.findIndex((title) => title.includes(product1));
    await page.locator('.card-body').nth(idx1).locator('text= Add To Cart').click();

    const idx2 = titles.findIndex((title) => title.includes(product2));
    await page.locator('.card-body').nth(idx2).locator('text= Add To Cart').click();

    await page.locator('[routerlink="/dashboard/cart"]').click();
    await context.close();
});
```

---

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
    await context.close();
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
    await Promise.all([page.locator('#signInBtn').click(), page.waitForNavigation()]);
    const titles = await page.locator('.card-body a').allTextContents();
    log(titles);
    await context.close();
});
```

#### Wait For Element To Load

```JavaScript
test.only('E2E - Test 1', async ({ browser }) => {
    const product1 = 'adidas original';
    const product2 = 'qwerty';
    const { page, context } = await newPageFromBrowser(browser);
    await page.goto('https://rahulshettyacademy.com/client');

    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill(password);
    await page.locator('[value="Login"]').click();
    await page.waitForLoadState('networkidle');
    const titles = await page.locator('.card-body b').allTextContents();
    const idx1 = titles.findIndex((title) => title.includes(product1));
    await page.locator('.card-body').nth(idx1).locator('text= Add To Cart').click();
    const idx2 = titles.findIndex((title) => title.includes(product2));
    await page.locator('.card-body').nth(idx2).locator('text= Add To Cart').click();
    await page.locator('[routerlink="/dashboard/cart"]').click();

    await page.locator('.cart li').last().waitFor();
    const exists = await page.locator(`h3:has-text('${product1}')`).isVisible();
    await expect(exists).toBeTruthy();
    await context.close();
});
```

---

### Assertions

`Playwright` Test uses [expect](https://jestjs.io/docs/expect) library for test assertions. This library provides a lot of matchers like `toEqual`, `toContain`, `toMatch`, `toMatchSnapshot` and many more:

```JavaScript
expect(success).toBeTruthy();
```

Playwright also extends it with convenience async matchers that will wait until the expected condition is met. Consider the following example:

```JavaScript
await expect(page.getByTestId('status')).toHaveText('Submitted');
```

`Playwright` Test will be re-testing the element with the test id of `status` until the fetched element has the `"Submitted"` text. It will re-fetch the element and check it over and over, until the condition is met or until the timeout is reached. You can either pass this timeout or configure it once via the [testConfig.expect](https://playwright.dev/docs/api/class-testconfig#test-config-expect) value in the test config.

By default, the timeout for assertions is set to 5 seconds. Learn more about [various timeouts](https://playwright.dev/docs/test-timeouts).

#### List of Assertions

| Assertion                                                                                                                             | Description                       |
| ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| [expect(locator).toBeChecked()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-be-checked)             | Checkbox is checked               |
| [expect(locator).toBeDisabled()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-be-disabled)           | Element is disabled               |
| [expect(locator).toBeEditable()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-be-editable)           | Element is enabled                |
| [expect(locator).toBeEmpty()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-be-empty)                 | Container is empty                |
| [expect(locator).toBeEnabled()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-be-enabled)             | Element is enabled                |
| [expect(locator).toBeFocused()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-be-focused)             | Element is focused                |
| [expect(locator).toBeHidden()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-be-hidden)               | Element is not visible            |
| [expect(locator).toBeVisible()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-be-visible)             | Element is visible                |
| [expect(locator).toContainText()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-contain-text)         | Element contains text             |
| [expect(locator).toHaveAttribute()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-attribute)     | Element has a DOM attribute       |
| [expect(locator).toHaveClass()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-class)             | Element has a class property      |
| [expect(locator).toHaveCount()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-count)             | List has exact number of children |
| [expect(locator).toHaveCSS()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-css)                 | Element has CSS property          |
| [expect(locator).toHaveId()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-id)                   | Element has an ID                 |
| [expect(locator).toHaveJSProperty()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-js-property)  | Element has a JavaScript property |
| [expect(locator).toHaveScreenshot()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-screenshot-1) | Element has a screenshot          |
| [expect(locator).toHaveText()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-text)               | Element matches text              |
| [expect(locator).toHaveValue()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-value)             | Input has a value                 |
| [expect(locator).toHaveValues()](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-values)           | Select has options selected       |
| [expect(page).toHaveScreenshot()](https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-screenshot-1)          | Page has a screenshot             |
| [expect(page).toHaveTitle()](https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-title)                      | Page has a title                  |
| [expect(page).toHaveURL()](https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-url)                          | Page has a URL                    |
| [expect(apiResponse).toBeOK()](https://playwright.dev/docs/api/class-apiresponseassertions#api-response-assertions-to-be-ok)          | Response has an OK status         |

#### Negating Matchers

In general, we can expect the opposite to be true by adding a `.not` to the front of the matchers:

```JavaScript
expect(value).not.toEqual(0);await expect(locator).not.toContainText("some text");
```

#### Soft Assertions

By default, failed assertion will terminate test execution. Playwright also supports _soft assertions_: failed soft assertions **do not** terminate test execution, but mark the test as failed.

```JavaScript
// Make a few checks that will not stop the test when failed...
await expect.soft(page.getByTestId('status')).toHaveText('Success');
await expect.soft(page.getByTestId('eta')).toHaveText('1 day');

// ... and continue the test to check more things.
await page.getByRole('link', { name: 'next page' }).click();
await expect.soft(page.getByRole('heading', { name: 'Make another order' })).toBeVisible();
```

At any point during test execution, you can check whether there were any soft assertion failures:

```JavaScript
// Make a few checks that will not stop the test when failed...
await expect.soft(page.getByTestId('status')).toHaveText('Success');
await expect.soft(page.getByTestId('eta')).toHaveText('1 day');

// Avoid running further if there were soft assertion failures.
expect(test.info().errors).toHaveLength(0);
```

Note that soft assertions only work with Playwright test runner.

#### Custom Expect Message

You can specify a custom error message as a second argument to the `expect` function, for example:

```JavaScript
await expect(page.getByText('Name'), 'should be logged in').toBeVisible();
```

The error would look like this:

```JavaScript
    Error: should be logged in

Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for "getByText('Name')"


  2 |
  3 | test('example test', async({ page }) => {
> 4 |   await expect(page.getByText('Name'), 'should be logged in').toBeVisible();
    |                                                                  ^
  5 | });
  6 |
```

The same works with soft assertions:

```JavaScript
expect.soft(value, 'my soft assertion').toBe(56);
```

#### Polling

You can convert any synchronous `expect` to an asynchronous polling one using `expect.poll`.

The following method will poll given function until it returns HTTP status 200:

```JavaScript
await expect.poll(async () => {
  const response = await page.request.get('https://api.example.com');
  return response.status();
}, {
  // Custom error message, optional.
  message: 'make sure API eventually succeeds', // custom error message
  // Poll for 10 seconds; defaults to 5 seconds. Pass 0 to disable timeout.
  timeout: 10000,
}).toBe(200);
```

You can also specify custom polling intervals:

```JavaScript
await expect.poll(async () => {
  const response = await page.request.get('https://api.example.com');
  return response.status();
}, {
  // Probe, wait 1s, probe, wait 2s, probe, wait 10s, probe, wait 10s, probe, .... Defaults to [100, 250, 500, 1000].
  intervals: [1_000, 2_000, 10_000],
  timeout: 60_000
}).toBe(200);
```

#### Retrying

You can retry blocks of code until they are passing successfully.

```JavaScript
await expect(async () => {
  const response = await page.request.get('https://api.example.com');
  expect(response.status()).toBe(200);
}).toPass();
```

You can also specify custom timeout for retry intervals:

```JavaScript
await expect(async () => {
  const response = await page.request.get('https://api.example.com');
  expect(response.status()).toBe(200);
}).toPass({
  // Probe, wait 1s, probe, wait 2s, probe, wait 10s, probe, wait 10s, probe, .... Defaults to [100, 250, 500, 1000].
  intervals: [1_000, 2_000, 10_000],
  timeout: 60_000
});
```

### Child Window/Tab

```JavaScript
test.only('UI Controls - Child Window/Tab - Should Pass', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise');

    const blinkingEl = page.locator('[href*="documents-request"]');
    const [_, newPage] = await Promise.all([blinkingEl.click(), context.waitForEvent('page')]);
    const text = await newPage.locator('.red').textContent();
    log(text);
    await context.close();
});
```

### Codegen

```Bash
npx playwright codegen https://rogertakeshita.com
```

```JavaScript
test('test', async ({ page }) => {
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
    await context.close();
});
```

### Traces

We can enable traces and screenshots in the `playwright.config.js`

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
        // browserName: 'firefox',
        // browserName: 'webkit', // Safari
        headless: false,
        screenshot: 'on',
        trace: 'retain-on-failure',
    },
};

module.exports = config;
```

To preview and inspect a trace.

![](/assets/images/2023-01-11-12-11-16.png)

![](/assets/images/2023-01-11-12-19-57.png)

![](/assets/images/2023-01-11-12-16-41.png)
