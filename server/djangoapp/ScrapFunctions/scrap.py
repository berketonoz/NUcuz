# def parse_product(product, selectors):
#     product_name = product.find(selectors['name']['tag'], {'class': selectors['name']['class']})
#     product_currency = product.find(selectors['currency']['tag'], {'class': selectors['currency']['class']})
#     product_price_whole = product.find(selectors['price_whole']['tag'], {'class': selectors['price_whole']['class']})
#     product_price_fraction = product.find(selectors.get('price_fraction', {}).get('tag'), {'class': selectors.get('price_fraction', {}).get('class')}) if selectors.get('price_fraction') else None
#     product_stock_info = product.find(selectors['stock']['tag'], {'class': selectors['stock']['class']})

#     product_info = {}
#     if product_name:
#         product_info['name'] = product_name.get_text(strip=True)
#     if product_currency:
#         product_info['currency'] = product_currency.get_text(strip=True)
#     if product_price_whole:
#         product_info['price'] = product_price_whole.get_text(strip=True) + (product_price_fraction.get_text(strip=True) if product_price_fraction else '')
#     if product_stock_info:
#         product_info['stock'] = product_stock_info.get_text(strip=True)
#     else:
#         product_info['stock'] = 'In Stock'

#     return product_info

# def scrap_amazon(query):
#     base_url = 'https://www.amazon'
#     tlds = ['.ae', '.com.tr']
#     path = '/s?k='
#     selectors = {
#         'product': {'tag': 'div', 'attr': {'data-component-type': 's-search-result'}},
#         'name': {'tag': 'span', 'class': { 'rest': 'a-size-base-plus a-color-base a-text-normal', 'de': 'a-size-medium a-color-base a-text-normal'}},
#         'currency': {'tag': 'span', 'class': 'a-price-symbol'},
#         'price_whole': {'tag': 'span', 'class': 'a-price-whole'},
#         'price_fraction': {'tag': 'span', 'class': 'a-price-fraction'},
#         'stock': {'tag': 'span', 'class': 'a-size-base a-color-price'},
#     }
#     product_info_list = []

#     for tld in tlds:
#         url = f"{base_url}{tld}{path}{query}"
#         try:
#             page_content = fetch_page(url, headers)
#             soup = BeautifulSoup(page_content, 'html.parser')
#             products = soup.find_all(selectors['product']['tag'], selectors['product']['attr'])

#             for index, product in enumerate(products, start=1):
#                 product_info = parse_product(product, selectors)
#                 product_info['index'] = index
#                 product_info['url'] = f"{base_url}{tld}"
#                 product_info_list.append(product_info)
#         except Exception as e:
#             print(e)
#             return str(e)
    
#     return product_info_list

# def scrap_hepsiburada(query):
#     base_url = 'https://www.hepsiburada'
#     tlds = ['.com']
#     path = '/ara?q='
#     selectors = {
#         'product_list': {'tag': 'ul', 'class': 'productListContent'},
#         'product': {'tag': 'li', 'class': 'productListContent-frGrtf5XrVXRwJ05HUfU'},
#         'name': {'tag': 'h3', 'class': 'product-title'},
#         'currency': {'tag': 'span', 'class': 'currency'},
#         'price_whole': {'tag': 'span', 'class': 'price-value'},
#         'stock': {'tag': 'div', 'class': 'out-of-stock'},
#     }
#     product_info_list = []

#     for tld in tlds:
#         url = f"{base_url}{tld}{path}{query}"
#         try:
#             page_content = fetch_page(url, headers)
#             soup = BeautifulSoup(page_content, 'html.parser')
#             product_list = soup.find(selectors['product_list']['tag'], class_=lambda c: c and selectors['product_list']['class'] in c)
            
#             if product_list:
#                 products = product_list.find_all(selectors['product']['tag'], class_=selectors['product']['class'])
#             else:
#                 products = []

#             for index, product in enumerate(products, start=1):
#                 product_info = parse_product(product, selectors)
#                 product_info['index'] = index
#                 product_info['url'] = f"{base_url}{tld}"
#                 product_info_list.append(product_info)
#         except Exception as e:
#             print(e)
#             return str(e)
    
#     return product_info_list

# def home(request):
#     products = {}
#     query = 'razer'
#     products['amazon'] = scrap_amazon(query)
#     products['hepsiburada'] = scrap_hepsiburada(query)
#     return HttpResponse(json.dumps(products), content_type='application/json; charset=utf8')