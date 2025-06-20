import * as cheerio from 'cheerio';
import { writeFile } from 'fs/promises'; 

async function getProductData(){
    const response = await fetch('https://www.cashify.in/buy-landing/top-offers');
    const text = await response.text()    
    const $ = cheerio.load(text);
    const productData = []
    $('.flex.flex-row.gap-y-3.gap-x-2.justify-center.flex-wrap>div').each((index, element)=>{
        const title= $(element).find('.h-10').text();
        const price = $(element).find('.h1').text()
        productData.push({title, price});
    });
    await writeFile('products-cheerio.json', JSON.stringify(productData, null, 2), 'utf-8')
    console.log('Data saved to product-cheerio.json');
}

getProductData()