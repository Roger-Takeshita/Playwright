<h1 id='table-of-contents'>Table of Contents</h1>

- [PLAYWRIGHT](#playwright)
  - [Links](#links)
  - [Init Playwright](#init-playwright)
  - [Globally Available](#globally-available)
  - [Base Config](#base-config)
  - [Run tests](#run-tests)
  - [Docs](#docs)
    - [Debugging](#debugging)
      - [Using UI](#using-ui)
      - [VSCode](#vscode)
      - [Log All Request](#log-all-request)
    - [Import Parameters / Data](#import-parameters--data)
    - [Fixtures](#fixtures)
    - [Page](#page)
      - [Go Back](#go-back)
      - [Go Forward](#go-forward)
      - [Screenshot](#screenshot)
      - [Screenshot Snapshot](#screenshot-snapshot)
    - [Auto-waiting](#auto-waiting)
    - [Locators](#locators)
      - [Chaining](#chaining)
      - [CSS Locators](#css-locators)
      - [Tag Name (`has-text`)](#tag-name-has-text)
    - [Selectors](#selectors)
      - [CSS Selectors](#css-selectors)
      - [Dropdown](#dropdown)
      - [Radio Button](#radio-button)
      - [Checkbox](#checkbox)
      - [Check If an Element Has an Attribute](#check-if-an-element-has-an-attribute)
      - [Text](#text)
      - [Popup / Dialog](#popup--dialog)
      - [Hover](#hover)
      - [iFrame](#iframe)
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
    - [API](#api)
      - [Make API Call](#make-api-call)
      - [Running JavaScript Code](#running-javascript-code)
      - [Storage State](#storage-state)
      - [Intercept Response (fulfill)](#intercept-response-fulfill)
      - [Intercept Request (continue)](#intercept-request-continue)
      - [Intercept Abort (abort)](#intercept-abort-abort)
    - [Child Window/Tab](#child-windowtab)
    - [Codegen](#codegen)
    - [Traces](#traces)

---

# PLAYWRIGHT

## Links

- [Playwright Docs](https://playwright.dev/docs/intro)
- [Playwright Traces Preview](https://trace.playwright.dev/)

## Init Playwright

Init `Playwright`

```Bash
npm init playwright
```

## Globally Available

- [Playwright Browser](https://playwright.dev/docs/api/class-browser)
- [Playwright Page](https://playwright.dev/docs/api/class-page)

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
    await page.close();
});

test('Default context', async ({ page }) => {
    await page.goto('https://rogertakeshita.com');
});
```

## Base Config

- [Playwright Config](https://playwright.dev/docs/test-configuration)
- [Playwright Advanced Config](https://playwright.dev/docs/test-advanced)

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
        // browserName: 'firefox',
        // browserName: 'webkit', // Safari
        headless: true,
        screenshot: 'on',
        trace: 'retain-on-failure',
    },
};

module.exports = config;
```

## Run tests

- [Playwright Command Line](https://playwright.dev/docs/test-cli)

```Bash
npx playwright test
npx playwright test --project=chromium
npx playwright test --debug
npx playwright test --headed
npx playwright test --headed --debug
```

## Docs

---

### Debugging

- [Playwright Debugging Tests](https://playwright.dev/docs/debug)

#### Using UI

```JavaScript
await page.pause();
```

This command will pause the `Playwright` execution. Like a debugger breakpoint

#### VSCode

Using VSCode we need to update the `package.json` to include a generic test script

```JSON
"scripts": {
    "test": "npx playwright test"
},
```

Create/Add two new config to your `launch.json` debugger file

- Headed mode
- Headless mode

```JSON
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Playwright Headed",
            "skipFiles": ["<node_internals>/**"],
            "program": "${workspaceFolder}/tests/Api2.spec.js",
            "runtimeExecutable": "npm",
            "runtimeArgs": ["run-script", "test"],
            "args": ["--headed"]
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Playwright Headless",
            "skipFiles": ["<node_internals>/**"],
            "program": "${workspaceFolder}/tests/Api2.spec.js",
            "runtimeExecutable": "npm",
            "runtimeArgs": ["run-script", "test"],
            "args": []
        }
    ]
}
```

#### Log All Request

- [Playwright Service Workers:Network Events and Routing](https://playwright.dev/docs/service-workers-experimental#network-events-and-routing)

Add an event listener to all network `request`.

```JavaScript
page.on('request', (req) => {
    const currenturl = req.url();

    if (currenturl === reqresurl && !requestflag) {
        console.log({
            type: 'Request',
            url: currentURL,
        });
        requestFlag = true;
    }
});
```

```JavaScript
page.on('response', (res) => {
    const currentURL = res.url();

    if (currentURL === reqResURL && !responseFlag) {
        console.log({
            type: 'Response',
            url: currentURL,
            status: res.status(),
        });
        responseFlag = true;
    }
});
```

---

### Import Parameters / Data

```JavaScript
const usersData = require('../fixtures/placeholder.json');
const { user2 } = JSON.parse(JSON.stringify(usersData));
```

---

### Fixtures

- [Playwright Fixtures](https://playwright.dev/docs/api/class-fixtures)

```JavaScript
const playwright = require('@playwright/test');

exports.customTest = playwright.test.extend({
    user: {
        email: 'fakeaccount@getnada.com',
        password: 'superfake1B',
        productName: 'adidas original',
    },
});
```

```JavaScript
const { expect, request } = require('@playwright/test');
const { newPageFromBrowser, Request } = require('./_helpers');
const { customTest } = require('./customTest');

customTest('Fixture Custom Test', async ({ browser, user }) => {
    const apiContext = await request.newContext();
    const req = new Request(apiContext, user.email, user.password);
    const token = await req.login();

    const { page } = await newPageFromBrowser(browser, token);

    ...

    await page.close();
});
```

---

### Page

- [Playwright Page](https://playwright.dev/docs/api/class-page)

#### Go Back

- [Playwright Page:goBack](https://playwright.dev/docs/api/class-page#page-go-back)

```JavaScript
await page.goBack();
```

#### Go Forward

- [Playwright Page:goForward](https://playwright.dev/docs/api/class-page#page-go-forward)

```JavaScript
await page.goForward();
```

#### Screenshot

- [Playwright Screenshots](https://playwright.dev/docs/screenshots)

Take a screenshot from entire page

```JavaScript
await page.screenshot({ path: 'downloads/screenshot.png' });
```

Take a screenshot from a specific element only

```JavaScript
await page.locator('#displayed-text').screenshot({ path: 'downloads/screenshot_element.png' });
```

```JavaScript
const fieldTotal = await page.locator('fieldset').count();

for (let i = 0; i < fieldTotal; i++) {
    const currentText = await page.locator('fieldset').nth(i).locator('legend').textContent();
    if (currentText === 'Element Displayed Example') {
        idx = i;
        await page.locator('fieldset').nth(i).screenshot({ path: 'downloads/screenshot_visible.png' });
        break;
    }
}
```

#### Screenshot Snapshot

```JavaScript
await waitForAnimationEnd(page, '.heading-primary__text-title-1');
const currentScreenshot = await page.screenshot();
expect(currentScreenshot).toMatchSnapshot('original_rogertakeshita.png');
```

`waitForAnimationEnd` is a helper function to wait for the CSS animation to end

```JavaScript
const waitForAnimationEnd = async (page, selector, ms = 500) => {
    const result = await page
        .locator(selector)
        .evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)));
    await delay(ms);

    return result;
};
```

---

### Auto-waiting

- [Playwright Auto-waiting](https://playwright.dev/docs/actionability)

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

- [Playwright Locators](https://playwright.dev/docs/locators)

#### Chaining

- [Playwright Locators:Chaining Locators](https://playwright.dev/docs/locators#chaining-locators)

```JavaScript
await page.locator('button[type="button"]').nth(1).locator('text=Checkout').click();
//                             ^              ^                  ^             ^
//                             |              |                  |             └── Action
//                             |              |                  └── Text attribute
//                             |              └── Return second item
//                             └── Return an array of buttons
```

#### CSS Locators

- [Playwright Locators:CSS Locators](https://playwright.dev/docs/other-locators#css-locator)

#### Tag Name (`has-text`)

```JavaScript
await page.locator('.cart li').last().waitFor();
const exists = await page.locator(`h3:has-text('${product1}')`).isVisible();
await expect(exists).toBeTruthy();
```

---

### Selectors

- [Playwright Selectors](https://playwright.dev/docs/api/class-selectors)

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
await page.locator('select.form-control').selectOption('consult');
```

```JavaScript
await page.locator('.input.ddl').nth(0).click();
await page.locator('.input.ddl').nth(0).selectOption({ index: 5 });
await page.locator('.input.ddl').nth(1).click();
await page.locator('.input.ddl').nth(1).selectOption({ index: 22 });
```

#### Radio Button

```JavaScript
const userRadio = page.locator('.radiotextsty').last();

await userRadio.click();
await expect(userRadio).toBeChecked();
const isChecked = await userRadio.isChecked();
log(isChecked ? 'User Radio Is Checked' : 'User Radio Is NOT Checked');
```

#### Checkbox

```JavaScript
const termsBox = page.locator('#terms');

await termsBox.click();
await expect(termsBox).toBeChecked();
await termsBox.uncheck();
await expect(termsBox).not.toBeChecked();
const isChecked = await termsBox.isChecked();
await expect(isChecked).toBeFalsy();
```

#### Check If an Element Has an Attribute

```JavaScript
const blinkingEl = page.locator('[href*="documents-request"]');
await expect(blinkingEl).toHaveAttribute('class', 'blinkingText');
```

#### Text

```JavaScript
const titles = await page.locator('.card-body b').allTextContents();
const idx = titles.findIndex((title) => title.includes(item));
await page.locator('.card-body').nth(idx).locator('text= Add To Cart').click();
```

```JavaScript
const successMsg = await page.locator('.hero-primary');
await expect(successMsg).toHaveText('Thankyou for the order.');
```

#### Popup / Dialog

There is the `on` method, that will listen for events

We can listen for a JS event `dialog`, and whenever this event is trigged, then it will execute the defined action.

- Click on `Ok`

  ```JavaScript
  // Will listen for `dialog` event
  page.on('dialog', (dialog) => {
      dialog.accept();
  });

  // Triggers the dialog/popup event
  await page.locator('#confirmbtn').click();
  ```

- Click on `Cancel`

  ```JavaScript
  // Will listen for `dialog` event
  page.on('dialog', (dialog) => {
      dialog.dismiss();
  });

  // Triggers the dialog/popup event
  await page.locator('#confirmbtn').click();
  ```

#### Hover

```JavaScript
await page.locator('#mousehover').hover();
await page.locator('[href="#top"]').click();
```

#### iFrame

```JavaScript
await page.keyboard.down('End');
const framePage = await page.frameLocator('#courses-iframe');
await framePage.locator('li a[href="lifetime-access"]:visible').click();
const text = await framePage.locator('.text h2').textContent();
const subscriberNumber = text.split(' ')[1].replace(',', '');
expect(subscriberNumber).toBe('13522');
```

---

### Wait API / HTML

#### Wait For API To Idle

- [Playwright Frame:waitForLoadState](https://playwright.dev/docs/api/class-frame#frame-wait-for-load-state)

```JavaScript
await page.waitForLoadState('networkidle');
const titles = await page.locator('.card-body b').allTextContents();
```

#### Wait For HTML To Load

- [Playwright Frame:waitForNavigation](https://playwright.dev/docs/api/class-frame#frame-wait-for-navigation)

```JavaScript
// Wait until page change
await Promise.all([page.locator('#signInBtn').click(), page.waitForNavigation()]);
const titles = await page.locator('.card-body a').allTextContents();
```

#### Wait For Element To Load

- [Playwright Locators:waitFor](https://playwright.dev/docs/api/class-locator#locator-wait-for)

```JavaScript
await page.locator('.cart li').last().waitFor();
const exists = await page.locator(`h3:has-text('${product1}')`).isVisible();
await expect(exists).toBeTruthy();
```

---

### Assertions

- [Playwright Assertions](https://playwright.dev/docs/test-assertions)

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

---

### API

- [Playwright API Testing](https://playwright.dev/docs/test-api-testing)

#### Make API Call

- [Playwright API Request](https://playwright.dev/docs/api/class-apirequest)
- [Playwright API Response](https://playwright.dev/docs/api/class-apiresponse)

Skip login, using API call

```JavaScript
const email = 'anshika@gmail.com';
const password = 'Iamking@000';
const url = 'https://rahulshettyacademy.com/api/ecom/auth/login';
const data = {
    userEmail: email,
    userPassword: password,
};
let token;

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post(url, { data });
    await expect(loginResponse.ok()).toBeTruthy();
    const { token: jwt } = await loginResponse.json();
    log(jwt);
    token = jwt;
});
```

#### Running JavaScript Code

- [Playwright Page:addInitScript](https://playwright.dev/docs/api/class-page#page-add-init-script)

To run a JS code, we need o use `addInitScript()`

```JavaScript
await page.addInitScript((value) => {
    window.localStorage.setItem('token', value);
}, token);
```

#### Storage State

- [Playwright Browser:Storage State](https://playwright.dev/docs/api/class-browsercontext#browser-context-storage-state)

```JavaScript
const { test, expect } = require('@playwright/test');
const { newPageFromBrowser } = require('./_helpers');

const email = 'anshika@gmail.com';
const password = 'Iamking@000';
let customContext;

test.beforeAll(async ({ browser }) => {
    const filename = 'storageState.json';
    const { page, context } = await newPageFromBrowser(browser);
    await page.goto('https://rahulshettyacademy.com/client');

    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill(password);
    await page.locator('[value="Login"]').click();
    await page.waitForLoadState('networkidle');
    // Create a shareable file with all tokens / localStorage
    await context.storageState({ path: filename });
    // Create a new context using storageState
    customContext = await browser.newContext({ storageState: filename });
    await page.close();
});

test('API - Add Token To Storage State', async () => {
    // Create a new page using customContext
    const page = await customContext.newPage();
    ...
    await page.close();
});
```

#### Intercept Response (fulfill)

- [Playwright Route:fulfill](https://playwright.dev/docs/api/class-route#route-fulfill)

```JavaScript
await page.route(url, async (route) => {
    // Change our page into api request mode
    const response = await page.request.fetch(route.request());
    // Fufill promise
    const fakeData = {
        data: [],
        count: 0,
        message: 'No Orders',
    };
    route.fulfill({ response, body: JSON.stringify(fakeData) });
});

// Products page
//    Brower makes the api call
await page.goto('https://rahulshettyacademy.com/client');
await page.locator('button[routerlink="/dashboard/myorders"]').click();
```

#### Intercept Request (continue)

- [Playwright Route:continue](https://playwright.dev/docs/api/class-route#route-continue)

```JavaScript
const orderId = await page.locator('tr.ng-star-inserted').first().locator('th').textContent();

// Mock request
const url = `https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=${orderId}`;
const mokedUrl = 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=63c05b26568c3e9fb1f64469';


// We are overwriting the initial request url with mockedUrl
await page.route(url, (route) => {
    route.continue({ url: mokedUrl });
});

await page.locator('tr.ng-star-inserted').first().locator('button').first().click();
const text = await page.locator('.blink_me').textContent();
expect(text).toBe('You are not authorize to view this order');
```

#### Intercept Abort (abort)

- [Playwright Route:abort](https://playwright.dev/docs/api/class-route#route-abort)

We can also abort an API call. eg:

- Prevent the browser from downloading `CSS`
- Prevent the browser from downloading images

```JavaScript
await page.route('**/*.css', (route) => {
    route.abort();
});
```

```JavaScript
await page.route('**/*.{jpg,png,jpeg}', (route) => {
    ait route.abort();
});
```

---

### Child Window/Tab

```JavaScript
test('UI Controls - Child Window/Tab - Should Pass', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise');

    const blinkingEl = page.locator('[href*="documents-request"]');
    const [_, newPage] = await Promise.all([blinkingEl.click(), context.waitForEvent('page')]);
    const text = await newPage.locator('.red').textContent();
    log(text);
    await page.close();
});
```

---

### Codegen

- [Playwright Codegen](https://playwright.dev/docs/codegen-intro#running-codegen)

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
    await page.close();
});
```

### Traces

- [Playwright Traces](https://playwright.dev/docs/trace-viewer-intro)

To preview and inspect a trace.

![](/assets/images/2023-01-11-12-11-16.png)

![](/assets/images/2023-01-11-12-19-57.png)

![](/assets/images/2023-01-11-12-16-41.png)
