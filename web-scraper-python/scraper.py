import requests
from bs4 import BeautifulSoup
import json

def fetch_products(): 
    baseUrl = 'https://www.cashify.in'
    url = f"https://www.cashify.in/buy-landing/top-offers"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    products = []
    prod_elements = soup.find_all('div', class_='rounded-lg')
    for product in prod_elements: 
        title_elem = product.find('div', class_='body2 h-10 sm:h-11 line-clamp-2 font-bold text-primary')
        title = title_elem.text.strip() if title_elem else None

        link_elem = product.find('a')
        link = baseUrl + link_elem['href'] if link_elem and link_elem.has_attr('href') else None

        price_elem = product.find('div', class_='body2 font-bold body2 sm:caption leading-snug text-primary')
        price = price_elem.text.strip() if price_elem else None

        # mrp_elem = product.find('span', class_='caption line-through leading-snug')
        mrp_elem = product.find('span', attrs={'class': lambda x: x and 'line-through' in x})
        mrp = mrp_elem.text.strip() if mrp_elem else None

        disc_elem = product.find('div', class_='bg-success')
        disc = disc_elem.text.strip() if disc_elem else None

        # imglink_elem = product.find('img', class_='object-contain')
        # imglink = imglink_elem['src'] if imglink_elem and imglink_elem.has_attr('src') else None

        products.append({
            'title': title,
            'price': price,
            'mrp': mrp,
            'discount': disc,
            'link': link,
            # 'imglink': imglink
        })
    return products

# def fetch_books(page_number):
#   url = f"https://books.toscrape.com/catalogue/page-{page_number}.html"
#   response = requests.get(url)
#   soup = BeautifulSoup(response.text, 'html.parser')

#   books = []
#   book_elements = soup.find_all('article', class_='product_pod')

#   for book in book_elements:
#     title = book.find('h3').find('a')['title']
#     price = book.find('p', class_='price_color').text
#     stock = 'In stock' if 'In stock' in book.find('p', class_='instock availability').text else 'Out of stock'
#     rating = book.find('p', class_='star-rating')['class'][1]
#     link = book.find('h3').find('a')['href']

#     books.append({
#       'title': title,
#       'price': price,
#       'stock': stock,
#       'rating': rating,
#       'link': f"https://books.toscrape.com/catalogue/{link}"
#     })

#   return books

def main():
  # all_books = []
  all_products = []
  products_on_page = fetch_products()
  all_products.extend(products_on_page)
  # all_products = fetch_products()
  # max_pages = 10

  # for current_page in range(1, max_pages + 1):
  #   books_on_page = fetch_books(current_page)
  #   all_books.extend(books_on_page)
  #   print(f"Books on page {current_page}: {books_on_page}")

  # Save data to file
  with open('products.json', 'w', encoding='utf-8') as f:
    json.dump(all_products, f, indent=2, ensure_ascii=False)

  print('Data is saved to products.json')

if __name__ == "__main__":
  main()