import puppeteer from 'puppeteer';
import fs from 'fs';

const scrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // const allBooks = [];
  const allProducts = [];
  // let currentPage = 1;
  // const maxPages = 10;

  const url = `https://www.cashify.in/buy-landing/top-offers`;
  await page.goto(url);
  const baseUrl = 'https://www.cashify.in';
  const products = await page.evaluate((baseUrl) => {
    const pelements = document.querySelectorAll('.rounded-lg');
    return Array.from(pelements).map((product)=>{
      const linkElem = product.querySelector('a');
      const link = linkElem ? baseUrl + linkElem.getAttribute('href') : null;

      const titleElem = product.querySelector('.body2.h-10.sm\\:h-11.line-clamp-2.font-bold.text-primary');
      const title = titleElem ? titleElem.textContent.trim() : null;

      const priceElem = product.querySelector('.body2.font-bold.body2.sm\\:caption.leading-snug.text-primary');
      const price = priceElem ? priceElem.textContent.trim() : null;

      // MRP (original price, usually line-through)
      const mrpElem = product.querySelector('.caption.line-through.leading-snug.text-primary\\/50');
      const mrp = mrpElem ? mrpElem.textContent.trim() : null;

      // Discount (e.g., "41% OFF")
      const discountElem = product.querySelector('.body2.bg-success.w-fit.px-1\\.5.py-0\\.5.self-start.sm\\:caption.leading-4.font-bold.rounded.text-primary');
      const discount = discountElem ? discountElem.textContent.trim() : null;

      return { title, price, mrp, discount, link };
    });
  }, baseUrl);
  allProducts.push(...products);
  // console.log(`Products on page: `, products);
  // while (currentPage <= maxPages) {
  //   const url = `https://books.toscrape.com/catalogue/page-${currentPage}.html`;
  //   await page.goto(url);

  //   const books = await page.evaluate(() => {
  //     const bookElements = document.querySelectorAll('.product_pod');
  //     return Array.from(bookElements).map((book) => {
  //       const title = book.querySelector('h3 a').getAttribute('title');
  //       const price = book.querySelector('.price_color').textContent;
  //       const stock = book.querySelector('.instock.availability')
  //         ? 'In Stock'
  //         : 'Out Of Stock';
  //       const rating = book
  //         .querySelector('.star-rating')
  //         .className.split(' ')[1];
  //       const link = book.querySelector('h3 a').getAttribute('href');

  //       return {
  //         title,
  //         price,
  //         stock,
  //         rating,
  //         link,
  //       };
  //     });
  //   });

  //   allBooks.push(...books);
  //   console.log(`Books on page ${currentPage}: `, books);
  //   currentPage++;
  // }

  fs.writeFileSync('products.json', JSON.stringify(allProducts, null, 2));

  console.log('Data saved to products.json');

  await browser.close();
};

scrape();
