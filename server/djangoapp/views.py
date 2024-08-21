import json
import logging
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

def fetch_paginated_data(domain, query):
    products = []
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
            
    logger.info(f'Total number of products fetched: {len(products)}')
    return products


def publish_to_bigquery(data):
    url = "http://localhost:3030/products"
    headers = {'Content-Type': 'application/json'}
    try:
        response = requests.post(url, data=json.dumps(data), headers=headers)
        response.raise_for_status()  # Raises HTTPError for bad responses
        logger.info("Data published successfully to BigQuery")
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        logger.error(f"HTTP error occurred: {http_err}")
    except requests.exceptions.RequestException as req_err:
        logger.error(f"Error publishing to BigQuery: {req_err}")
    return None


def fetch_amazon_products(request):
    domain = "amazon"
    queries = []
    query = request.GET.get('search', 'versace')  # Fallback to a default query if not provided

    logger.info(f"Search query: {query}")
    
    data = fetch_paginated_data(domain, query)
    if data:
        publish_to_bigquery(data)
        return JsonResponse({'status': 200, 'products': data})
    else:
        return JsonResponse({'status': 500, 'error': 'Failed to fetch or publish products'})
