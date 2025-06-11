import puppeteer from "puppeteer";

/**
 * Controller function to scrape a webpage and take a screenshot.
 * This function is used for testing purposes.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

export const testScrape = async (req, res) => {
  try {
  const browser = await puppeteer.launch(
    {headless: true} // run in headless mode
  ); //open a new browser instance
  const page = await browser.newPage(); //open a page
  await page.goto("https://example.com"); //navigate to the URL


  } catch (error) {
    console.error("Error in testScrape function:", error);
    res.status(500).json({ error: "An error occurred while testing the scrape." });
    return;
  }
  console.log("testScrape function called");
}