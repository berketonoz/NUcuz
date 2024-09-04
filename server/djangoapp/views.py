import json
import logging
import threading
from django.http import JsonResponse
from djangoproj.settings import DOMAINS
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
# razer = 6590   -> 5551
# msi = 6649     -> 6029
# asus = 6624    -> 6051
# lenovo = 6692  -> 6012
# iphone = 6298  -> 4554
# samsung = 6629 -> 6183
# versace = 6434 -> 5495

# Set up logging
logging.basicConfig(
    level=logging.INFO,  # Set to DEBUG to capture more detailed logs
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def get_domain_request_details(domain):
    return DOMAINS[domain]['url'], DOMAINS[domain]['headers']


def format_url_with_query(url, query, page, country):
    return url                      \
        .replace('$QUERY', query)   \
        .replace('$PAGE', str(page))\
        .replace('$COUNTRY', country)


def handle_api_request(url, headers):
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json().get('data', {}).get('products', [])
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching data from {url}: {e}")
        return []

def fetch_paginated_data(query):
    products = []
    domain = "amazon"
    template_url, headers = get_domain_request_details(domain)

    for tld in DOMAINS[domain]['TLDs']:
        logger.info(f"Fetching products from {domain}.{tld}...")
        page = 1
        
        num_of_products = 0
        while True:
            formatted_url = format_url_with_query(template_url, query, page, tld)
            fetched_products = handle_api_request(formatted_url, headers)
            num_of_products += len(fetched_products)
            # print(f'Page({page}): Fetched {num_of_products} number of products', end='\r')

            if not fetched_products:
                logger.info(f'Fetched {num_of_products} from {tld}, stopping.')
                break
            
            for product in fetched_products:
                product['country'] = tld
                products.append(product)

            logger.debug(f'Page({page}): {len(fetched_products)} products fetched')
            page += 1
            # For Debug purposes
            if page == 2:
                return products
            
    logger.info(f'Total number of products fetched: {len(products)}')
    return products


def publish_to_bigquery(data):
    try:
        url = "http://localhost:3030/load_amazon"
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, data=json.dumps(data), headers=headers)
        response.raise_for_status()  # Raises HTTPError for bad responses
        logger.info("Data published successfully to BigQuery")
    except requests.exceptions.HTTPError as http_err:
        logger.error(f"HTTP error occurred: {http_err}")
    except requests.exceptions.RequestException as req_err:
        logger.error(f"Error publishing to BigQuery: {req_err}")



def load_amazon_products(request):
    queries = ["razer", "msi", "asus", "lenovo"]
    data = []

    for query in queries:
        data += fetch_paginated_data(query)
    
        if data:
            # Run publish_to_bigquery in a separate thread
            threading.Thread(target=publish_to_bigquery, args=(data,)).start()
        else:
            return JsonResponse({'status': 500, 'error': 'Failed to fetch products'})
    return JsonResponse({'status': 200, 'products': data})

