import json
from urllib.parse import urlparse
from django.http import HttpResponse
from django.shortcuts import render

import requests
from bs4 import BeautifulSoup

def scrap_amazon(query):
    protocol = 'https://www.'
    domain = 'amazon'
    path = '/s?k='
    tlds = ['.ae', '.com.tr']
    selectors = {
        'product': {'tag': 'div', 'attr': {'data-component-type': 's-search-result'}},
        'name': {'tag': 'span', 'class': 'a-size-base-plus a-color-base a-text-normal'},
        'currency': {'tag': 'span', 'class': 'a-price-symbol'},
        'price_whole': {'tag': 'span', 'class': 'a-price-whole'},
        'price_fraction': {'tag': 'span', 'class': 'a-price-fraction'},
        'stock': {'tag': 'span', 'class': 'a-size-base a-color-price'},
    }
    headers = {
        # Cookie MUST be included in the header  
        'Cookie': '',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
    }
    product_info_list = []
    
    for tld in tlds:
        url = protocol + domain + tld + path + query
        print("URL: ", url)
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            return f"Failed to retrieve the webpage. Status code: {response.status_code}"

        try:
            # Extracting the product names and prices from the search results
            soup = BeautifulSoup(response.content, 'html.parser')
            products = soup.find_all(selectors['product']['tag'], selectors['product']['attr'])
            index = 1
            extracted_data = []
            for product in products:
                product_name = product.find(selectors['name']['tag'], {'class': selectors['name']['class']})
                product_currency = product.find(selectors['currency']['tag'], {'class': selectors['currency']['class']})
                product_price_whole = product.find(selectors['price_whole']['tag'], {'class': selectors['price_whole']['class']})
                product_price_fraction = product.find(selectors['price_fraction']['tag'], {'class': selectors['price_fraction']['class']})
                product_stock_info = product.find(selectors['stock']['tag'], {'class': selectors['stock']['class']})

                p = {'index': index, 'url': domain + tld }
                if product_name:
                    p['name'] = product_name.get_text(strip=True)
                if product_currency:
                    p['currency'] = product_currency.get_text(strip=True)
                if product_price_whole:
                    p['price'] = product_price_whole.get_text(strip=True) + (product_price_fraction.get_text(strip=True) if product_price_fraction else '')
                if product_stock_info:
                    p['stock'] = product_stock_info.get_text(strip=True)
                else:
                    p['stock'] = 'In Stock'
                extracted_data.append(p)
                index += 1
            product_info_list.extend(extracted_data)
        except AttributeError as e:
            return f"An error occurred while parsing the webpage: {e}"
    return product_info_list if product_info_list else "No products found."

def scrap_hepsiburada(query):
    protocol = 'https://www.'
    domain = 'hepsiburada'
    path = '/ara?q='
    tlds = ['.com']
    selectors = {
        'product_list': {'tag': 'ul', 'class': 'productListContent'},
        'product': {'tag': 'li', 'class': 'productListContent-frGrtf5XrVXRwJ05HUfU'},
        'name': {'tag': 'h3', 'class': 'product-title'},
        'currency': {'tag': 'span', 'class': 'currency'},
        'price_whole': {'tag': 'span', 'class': 'price-value'},
        'stock': {'tag': 'div', 'class': 'out-of-stock'},
    }
    headers = {
        'Cookie': 'i18n-prefs=AED; session-id=260-9454958-2784525; session-id-time=2082787201l',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    product_info_list = []
    
    for tld in tlds:
        url = protocol + domain + tld + path + query
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            return f"Failed to retrieve the webpage. Status code: {response.status_code}"

        try:
            # Extracting the product names and prices from the search results
            soup = BeautifulSoup(response.content, 'html.parser')
            product_list = soup.find(selectors['product_list']['tag'], class_=lambda c: c and selectors['product_list']['class'] in c)
            if product_list:
                products = product_list.find_all(selectors['product']['tag'], class_=selectors['product']['class'])
            else:
                products = []
            index = 1
            extracted_data = []
            for product in products:
                product_name = product.find(selectors['name']['tag'], {'class': selectors['name']['class']})
                product_currency = product.find(selectors['currency']['tag'], {'class': selectors['currency']['class']})
                product_price_whole = product.find(selectors['price_whole']['tag'], {'class': selectors['price_whole']['class']})
                product_stock_info = product.find(selectors['stock']['tag'], {'class': selectors['stock']['class']})
                
                p = {'index': index}
                if product_name:
                    p['name'] = product_name.get_text(strip=True)
                if product_currency:
                    p['currency'] = product_currency.get_text(strip=True)
                if product_price_whole:
                    p['price'] = product_price_whole.get_text(strip=True)
                if product_stock_info:
                    p['stock'] = product_stock_info.get_text(strip=True)
                else:
                    p['stock'] = 'In Stock'
                extracted_data.append(p)
                index += 1
            print(f'{query.capitalize()} in {domain+tld} has {len(extracted_data)} different products')
            product_info_list.extend(extracted_data)
        except AttributeError as e:
            return f"An error occurred while parsing the webpage: {e}"
    return product_info_list if product_info_list else "No products found."


# Create your views here.
def home(request):
    # Products declaration
    products = {}

    # Example usage
    query = 'razer'
    products['amazon'] = scrap_amazon(query)
    # products['hepsiburada'] = scrap_hepsiburada(query)
    print(products)
    return HttpResponse(json.dumps(products),
                    content_type='application/json; charset=utf8')
