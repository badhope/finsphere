# Web Scraping

## Description
Expert in web scraping and automation using Puppeteer, Playwright, and Python tools including anti-detection strategies, data extraction, and ethical scraping practices.

## Usage Scenario
Use this skill when:
- Extracting data from websites
- Automating browser interactions
- Building web scrapers
- Handling dynamic content
- Implementing anti-detection
- Processing scraped data

## Instructions

### Puppeteer

1. **Basic Setup**
   ```typescript
   import puppeteer, { Browser, Page } from 'puppeteer';
   
   async function scrape(url: string) {
     const browser = await puppeteer.launch({
       headless: 'new',
       args: ['--no-sandbox', '--disable-setuid-sandbox'],
     });
     
     const page = await browser.newPage();
     
     await page.setUserAgent(
       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
     );
     
     await page.goto(url, { waitUntil: 'networkidle2' });
     
     const data = await page.evaluate(() => {
       const items = document.querySelectorAll('.item');
       return Array.from(items).map((item) => ({
         title: item.querySelector('.title')?.textContent?.trim(),
         price: item.querySelector('.price')?.textContent?.trim(),
         link: item.querySelector('a')?.href,
       }));
     });
     
     await browser.close();
     return data;
   }
   ```

2. **Handling Dynamic Content**
   ```typescript
   async function scrapeDynamic(url: string) {
     const browser = await puppeteer.launch();
     const page = await browser.newPage();
     
     await page.goto(url);
     
     await page.waitForSelector('.content', { timeout: 10000 });
     
     await autoScroll(page);
     
     const data = await page.evaluate(() => {
       return document.querySelectorAll('.item').length;
     });
     
     await browser.close();
     return data;
   }
   
   async function autoScroll(page: Page) {
     await page.evaluate(async () => {
       await new Promise<void>((resolve) => {
         let totalHeight = 0;
         const distance = 100;
         const timer = setInterval(() => {
           const scrollHeight = document.body.scrollHeight;
           window.scrollBy(0, distance);
           totalHeight += distance;
           
           if (totalHeight >= scrollHeight) {
             clearInterval(timer);
             resolve();
           }
         }, 100);
       });
     });
   }
   ```

3. **Form Interaction**
   ```typescript
   async function loginAndScrape(url: string) {
     const browser = await puppeteer.launch();
     const page = await browser.newPage();
     
     await page.goto(url);
     
     await page.type('#email', 'user@example.com');
     await page.type('#password', 'password123');
     await page.click('#login-button');
     
     await page.waitForNavigation({ waitUntil: 'networkidle2' });
     
     const data = await page.evaluate(() => {
       return document.querySelector('.user-data')?.textContent;
     });
     
     await browser.close();
     return data;
   }
   ```

4. **Screenshot and PDF**
   ```typescript
   async function capturePage(url: string) {
     const browser = await puppeteer.launch();
     const page = await browser.newPage();
     
     await page.setViewport({ width: 1920, height: 1080 });
     await page.goto(url);
     
     await page.screenshot({
       path: 'screenshot.png',
       fullPage: true,
     });
     
     await page.pdf({
       path: 'page.pdf',
       format: 'A4',
     });
     
     await browser.close();
   }
   ```

### Playwright

1. **Basic Scraping**
   ```typescript
   import { chromium } from 'playwright';
   
   async function scrape(url: string) {
     const browser = await chromium.launch();
     const context = await browser.newContext({
       userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
       viewport: { width: 1920, height: 1080 },
     });
     
     const page = await context.newPage();
     await page.goto(url);
     
     const items = await page.locator('.item').all();
     
     const data = await Promise.all(
       items.map(async (item) => ({
         title: await item.locator('.title').textContent(),
         price: await item.locator('.price').textContent(),
       }))
     );
     
     await browser.close();
     return data;
   }
   ```

2. **Handling Multiple Pages**
   ```typescript
   async function scrapeMultiplePages(baseUrl: string, pages: number) {
     const browser = await chromium.launch();
     const results = [];
     
     for (let i = 1; i <= pages; i++) {
       const page = await browser.newPage();
       await page.goto(`${baseUrl}?page=${i}`);
       
       const data = await page.evaluate(() => {
         return Array.from(document.querySelectorAll('.item')).map((item) => ({
           title: item.querySelector('.title')?.textContent,
         }));
       });
       
       results.push(...data);
       await page.close();
       
       await new Promise((r) => setTimeout(r, 1000));
     }
     
     await browser.close();
     return results;
   }
   ```

3. **Intercepting Requests**
   ```typescript
   async function scrapeWithInterception(url: string) {
     const browser = await chromium.launch();
     const context = await browser.newContext();
     const page = await context.newPage();
     
     const apiData: any[] = [];
     
     page.on('response', async (response) => {
       if (response.url().includes('/api/data')) {
         const data = await response.json();
         apiData.push(data);
       }
     });
     
     await page.goto(url);
     await page.waitForTimeout(5000);
     
     await browser.close();
     return apiData;
   }
   ```

### Python Scraping

1. **BeautifulSoup**
   ```python
   import requests
   from bs4 import BeautifulSoup
   
   def scrape(url: str) -> list[dict]:
       headers = {
           'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
       }
       
       response = requests.get(url, headers=headers)
       soup = BeautifulSoup(response.content, 'html.parser')
       
       items = []
       for item in soup.select('.item'):
           items.append({
               'title': item.select_one('.title').get_text(strip=True),
               'price': item.select_one('.price').get_text(strip=True),
               'link': item.select_one('a')['href'],
           })
       
       return items
   ```

2. **Scrapy**
   ```python
   import scrapy
   
   class ProductSpider(scrapy.Spider):
       name = 'products'
       start_urls = ['https://example.com/products']
       
       def parse(self, response):
           for item in response.css('.product'):
               yield {
                   'title': item.css('.title::text').get(),
                   'price': item.css('.price::text').get(),
                   'link': item.css('a::attr(href)').get(),
               }
           
           next_page = response.css('.next::attr(href)').get()
           if next_page:
               yield response.follow(next_page, self.parse)
   ```

3. **Selenium**
   ```python
   from selenium import webdriver
   from selenium.webdriver.common.by import By
   from selenium.webdriver.support.ui import WebDriverWait
   from selenium.webdriver.support import expected_conditions as EC
   
   def scrape_dynamic(url: str):
       options = webdriver.ChromeOptions()
       options.add_argument('--headless')
       options.add_argument('--no-sandbox')
       
       driver = webdriver.Chrome(options=options)
       driver.get(url)
       
       WebDriverWait(driver, 10).until(
           EC.presence_of_element_located((By.CSS_SELECTOR, '.content'))
       )
       
       items = []
       elements = driver.find_elements(By.CSS_SELECTOR, '.item')
       
       for element in elements:
           items.append({
               'title': element.find_element(By.CSS_SELECTOR, '.title').text,
               'price': element.find_element(By.CSS_SELECTOR, '.price').text,
           })
       
       driver.quit()
       return items
   ```

### Anti-Detection Strategies

1. **Stealth Mode**
   ```typescript
   import puppeteer from 'puppeteer';
   import StealthPlugin from 'puppeteer-extra-plugin-stealth';
   
   const puppeteerExtra = require('puppeteer-extra');
   puppeteerExtra.use(StealthPlugin());
   
   async function scrapeStealth(url: string) {
     const browser = await puppeteerExtra.launch({
       headless: true,
       args: ['--no-sandbox'],
     });
     
     const page = await browser.newPage();
     
     await page.evaluateOnNewDocument(() => {
       Object.defineProperty(navigator, 'webdriver', { get: () => false });
       Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
       Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
     });
     
     await page.goto(url);
     
     const data = await page.evaluate(() => {
       return document.body.innerHTML;
     });
     
     await browser.close();
     return data;
   }
   ```

2. **Rate Limiting**
   ```typescript
   import Bottleneck from 'bottleneck';
   
   const limiter = new Bottleneck({
     minTime: 1000,
     maxConcurrent: 3,
   });
   
   async function scrapeWithRateLimit(urls: string[]) {
     const browser = await puppeteer.launch();
     
     const results = await Promise.all(
       urls.map((url) =>
         limiter.schedule(async () => {
           const page = await browser.newPage();
           await page.goto(url);
           const data = await page.evaluate(() => document.title);
           await page.close();
           return data;
         })
       )
     );
     
     await browser.close();
     return results;
   }
   ```

3. **Proxy Rotation**
   ```typescript
   const proxies = [
     'http://proxy1:8080',
     'http://proxy2:8080',
     'http://proxy3:8080',
   ];
   
   async function scrapeWithProxy(url: string) {
     const proxy = proxies[Math.floor(Math.random() * proxies.length)];
     
     const browser = await puppeteer.launch({
       args: [`--proxy-server=${proxy}`],
     });
     
     const page = await browser.newPage();
     await page.goto(url);
     
     const data = await page.evaluate(() => document.title);
     
     await browser.close();
     return data;
   }
   ```

### Data Processing

1. **Cleaning Data**
   ```typescript
   function cleanData(data: any[]): any[] {
     return data
       .filter((item) => item.title && item.price)
       .map((item) => ({
         title: item.title.trim(),
         price: parseFloat(item.price.replace(/[^0-9.]/g, '')),
         link: item.link?.startsWith('http') ? item.link : `https://example.com${item.link}`,
       }))
       .filter((item) => !isNaN(item.price));
   }
   ```

2. **Saving to File**
   ```typescript
   import fs from 'fs';
   import { parse } from 'json2csv';
   
   function saveToJSON(data: any[], filename: string) {
     fs.writeFileSync(filename, JSON.stringify(data, null, 2));
   }
   
   function saveToCSV(data: any[], filename: string) {
     const csv = parse(data);
     fs.writeFileSync(filename, csv);
   }
   ```

## Output Contract
- Scraping scripts
- Data extraction logic
- Anti-detection configurations
- Rate limiting strategies
- Data processing pipelines

## Constraints
- Respect robots.txt
- Implement rate limiting
- Handle errors gracefully
- Use appropriate delays
- Follow ethical guidelines

## Examples

### Example 1: E-commerce Scraper
```typescript
async function scrapeEcommerce(url: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(url);
  await page.waitForSelector('.product-grid');
  
  const products = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.product')).map((product) => ({
      name: product.querySelector('.name')?.textContent?.trim(),
      price: product.querySelector('.price')?.textContent?.trim(),
      image: product.querySelector('img')?.src,
      rating: product.querySelector('.rating')?.textContent?.trim(),
    }));
  });
  
  await browser.close();
  return products;
}
```

### Example 2: Paginated Scraper
```typescript
async function scrapePaginated(baseUrl: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const allItems = [];
  let hasNextPage = true;
  let currentPage = 1;
  
  while (hasNextPage) {
    await page.goto(`${baseUrl}?page=${currentPage}`);
    
    const items = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.item')).map((item) => ({
        title: item.querySelector('.title')?.textContent,
      }));
    });
    
    allItems.push(...items);
    
    hasNextPage = await page.$('.next-page') !== null;
    currentPage++;
    
    await new Promise((r) => setTimeout(r, 1000));
  }
  
  await browser.close();
  return allItems;
}
```
