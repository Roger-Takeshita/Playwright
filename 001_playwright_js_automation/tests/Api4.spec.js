const { test, expect, request } = require('@playwright/test');
const fs = require('fs');

const fileExists = async (filePath) => {
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
};

const readJSON = async (filePath) => {
    try {
        const rawData = await fs.promises.readFile(filePath);
        return JSON.parse(rawData);
    } catch (error) {
        console.log(error);
    }
};

const saveFile = async (filePath, text) => {
    try {
        await fs.promises.writeFile(filePath, text);
        return true;
    } catch (error) {
        return false;
    }
};

const toSnakeCase = (str) =>
    str &&
    str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map((x) => x.toLowerCase())
        .join('_');

test('API - Snapshot Should Pass', async ({ }, testInfo) => {
    const url = 'https://swapi.dev/api/people/1';

    const apiContext = await request.newContext();
    const rawResponse = await apiContext.get(url);
    const response = await rawResponse.json();

    const dir = '/Users/roger-that/Documents/Codes/Playwright/001_playwright_js_automation/tests/JSON';
    const filePath = `${dir}/${toSnakeCase(testInfo.title)}.json`;

    const fileExist = await fileExists(filePath);

    if (fileExist) {
        const rawData = await readJSON(filePath);
        expect(JSON.stringify(response, undefined, 2)).toBe(JSON.stringify(rawData, undefined, 2));
        console.log('\n  Same snapshot\n');
    } else {
        const folderExist = await fileExists(dir);
        if (!folderExist) await fs.promises.mkdir(dir, { recursive: true });
        await saveFile(filePath, JSON.stringify(response, undefined, 2));
        console.log('\n  Saved new snapshot\n');
    }
});

test('API - Snapshot Should Fail', async ({ }, testInfo) => {
    const url = 'https://swapi.dev/api/people/1';

    const apiContext = await request.newContext();
    const rawResponse = await apiContext.get(url);
    const response = await rawResponse.json();

    const dir = '/Users/roger-that/Documents/Codes/Playwright/001_playwright_js_automation/tests/JSON';
    const filePath = `${dir}/${toSnakeCase(testInfo.title)}.json`;

    const fileExist = await fileExists(filePath);

    if (fileExist) {
        const rawData = await readJSON(filePath);
        rawData.wrongData = 'Fake Wrong Data';
        expect(JSON.stringify(response, undefined, 2)).toBe(JSON.stringify(rawData, undefined, 2));
        console.log('\n  Same snapshot\n');
    } else {
        const folderExist = await fileExists(dir);
        if (!folderExist) await fs.promises.mkdir(dir, { recursive: true });
        await saveFile(filePath, JSON.stringify(response, undefined, 2));
        console.log('\n  Saved new snapshot\n');
    }
});

// https://github.com/microsoft/playwright/issues/14271
// https://github.com/approvals/Approvals.NodeJS
