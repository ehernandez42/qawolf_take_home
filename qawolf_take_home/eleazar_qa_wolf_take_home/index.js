// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const {chromium} = require("playwright");
const {expect} = require("playwright/test");
const {test} = require("playwright/test")

//converting the strings into actual timestamps
function timeStamp(string) {
    const now = new Date();
    const [value, unit] = string.split(" ")

    if (unit === "minute" || unit === "minutes") {
        return new Date(now.getTime() - parseInt(value) * 60 * 1000)
    } else if (unit === "hour" || unit === "hours") {
        return new Date(now.getTime() - parseInt(value) * 60 * 60 * 1000)
    } else {
        throw new Error("Invalid")
    }

}

async function sortHackerNewsArticles(maxCount = 100) {
    // launch browser
    const browser = await chromium.launch({headless: false});
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://news.ycombinator.com/newest");


    //grab all the articles up to 100

    let hasNextPage = true;
    const articlesArray = [];

    while (articlesArray.length < maxCount && hasNextPage) {
        //grab what is in current page
        const locatorCount = await page.locator(".subtext .subline .age")
        for (let i = 0; i < await locatorCount.count(); i++) {
            const element = await locatorCount.nth(i);
            const innerText = await element.innerText();
            //refer to function above
            const result = timeStamp(innerText)
            articlesArray.push(result)
        }

        //check to start grabbing a new page
        if (articlesArray.length >= maxCount) {
            hasNextPage = false;
            break;
        } else {
            const nextButton = await page.locator(".morelink");
            await nextButton.click();
            await page.waitForLoadState("networkidle")
        }
    }
    //this is the last part of the script -> we put some kind of assertion that says its true or false?
    let result = true;
    const currentDate = Date.now();

    for (let i = 1; i < articlesArray.length; i++) {
        result = (currentDate - articlesArray[i]) >= (currentDate - articlesArray[i-1]);
    }
    await browser.close()
    await expect(result).toEqual(true);
}

(async () => {
    await sortHackerNewsArticles();
})();
