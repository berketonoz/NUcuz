import json
import logging
import threading
import requests
from django.http import JsonResponse
from djangoproj.settings import DOMAINS
from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.contrib.auth import login, authenticate
from django.views.decorators.csrf import csrf_exempt
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


@csrf_exempt  # Only use this if you're testing API requests and not using CSRF tokens for now
def login_view(request):
    if request.method == 'POST':
        # Extract username and password from the request
        data = json.loads(request.body)
        username = data.get('userName')
        password = data.get('password')

        # Authenticate the user
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            # Log the user in if authentication is successful
            login(request, user)
            return JsonResponse({"status": "Authenticated", "userName": user.username})
        else:
            # If authentication fails
            return JsonResponse({"status": "Failed", "message": "Invalid credentials"}, status=401)
    
    return JsonResponse({"status": "Failed", "message": "Invalid request method"}, status=405)


def logout_request(request):
    """logout_request function for handling /logout route"""
    logout(request)
    data = {"userName": ""}
    return JsonResponse(data)


@csrf_exempt
def registration(request):
    """registration function for handling /register route"""
    # context = {}
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']
    username_exist = False
    # email_exist = False
    try:
        # Check if user already exists
        User.objects.get(username=username)
        username_exist = True
    except User.DoesNotExist as e:
        # Handle the case when user does not exist, e.g., show an error message or create a user
        print("User does not exist: ", e)
    # If it is a new user
    if not username_exist:
        # Create user in auth_user table
        user = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password,
            email=email)
        # Login the user and redirect to list page
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
    else:
        data = {"userName": username, "error": "Already Registered"}
    return JsonResponse(data)


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
        logger.info(f"Fetching {query} products from {domain}.{tld}...")
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
                if product['product_price'] and product['currency']:
                    product['country'] = tld
                    products.append(product)

            logger.debug(f'Page({page}): {len(fetched_products)} products fetched')
            page += 1
            # For Test purposes (Not to overload bq initially)
            if page == 2:
                break
            
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
        threading.Thread(target=publish_to_bigquery, args=(data,)).start()
    else:
        return JsonResponse({'status': 500, 'error': 'Failed to fetch products'})
    return JsonResponse({'status': 200, 'products': data})

