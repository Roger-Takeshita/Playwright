const { test, expect } = require('@playwright/test');

class Login {
    constructor(browser, storageStateFile) {
        // if (Login._instance) return Login._instance;
        // Login._instance = this;

        this.browser = browser;
        this.storageStateFile = storageStateFile;
        this.username;
        this.context;
        this.page;
    }

    async login(username) {
        this.username = username;

        if (this.storageStateFile) {
            console.log(`Updading storageStateFile`, this.storageStateFile);
            this.context = await this.browser.newContext({ storageState: this.storageStateFile });
        } else {
            this.context = await this.browser.newContext();
        }

        this.page = await this.context.newPage();
        console.log(`Logged in as ${this.username}`);
        return { page: this.page, context: this.context };
    }
}

class Page extends Login {
    constructor(page) {
        super();
        this.page = page;
        this.agGridId = 'page-event-id';
    }

    goTo(url) {
        return this.page.goto(url);
    }

    getPageTitle() {
        return this.page.title();
    }
}

class EventPage extends Page {
    constructor(page) {
        super();
        this.page = page;
        this.agGridId = 'event-ag-grid';
    }

    async goToPage(url) {
        await this.goTo(url);
    }

    async validatePageTitle(title) {
        const actualTitle = await this.getPageTitle();
        expect(actualTitle).toBe(title);
    }

    async fillForm(name, email, msg) {
        await this.page.locator('#name').fill(name);
        await this.page.locator('[placeholder="Your Email (Required)"]').fill(email);
        await this.page.locator('[name="msg"]').fill(msg);
    }
}

test('Custom Class Test', async ({ browser }) => {
    const loginPage = new Login(browser);
    const { page } = await loginPage.login('Roger-That');

    const eventPage = new EventPage(page);

    await eventPage.goToPage('https://rogertakeshita.com');
    await eventPage.validatePageTitle('Roger Takeshita');
    await eventPage.fillForm('Roger', 'roger@fake.com', 'Testing....');
    await page.close();
});

test('Custom Class Test - storageState', async ({ browser }) => {
    const loginPage = new Login(browser, 'storageState.json');
    const { page } = await loginPage.login('Roger-That');

    const eventPage = new EventPage(page);

    await eventPage.goToPage('https://rogertakeshita.com');
    await eventPage.validatePageTitle('Roger Takeshita');
    await eventPage.fillForm('Roger', 'roger@fake.com', 'Testing....');
    await page.pause();
    await page.close();
});
