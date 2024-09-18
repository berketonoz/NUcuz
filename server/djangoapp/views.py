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
from .restapis import get_request
from bs4 import BeautifulSoup
from pymongo import MongoClient

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token


GOOGLE_CLIENT_ID = '433919242072-1tlg6pcbsdcolj0l6b236m9o36abj8lg.apps.googleusercontent.com'


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
        username = data.get('username')
        password = data.get('password')

        # Authenticate the user
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            # Log the user in if authentication is successful
            login(request, user)
            return JsonResponse({"status": "Authenticated", "username": user.username, "screen_name": user.first_name.capitalize()})
        else:
            # If authentication fails
            return JsonResponse({"status": "Failed", "message": "Invalid credentials"}, status=401)
    
    return JsonResponse({"status": "Failed", "message": "Invalid request method"}, status=405)


def logout_request(request):
    """logout_request function for handling /logout route"""
    logout(request)
    data = {"username": ""}
    return JsonResponse(data)


@csrf_exempt
def registration(request):
    """registration function for handling /register route"""
    # context = {}
    data = json.loads(request.body)
    username = data['email']
    password = data['password']
    first_name = data['firstname']
    last_name = data['lastname']
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
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request, user)
        data = {"username": username, "screen_name": first_name.capitalize(), "status": "Authenticated"}
    else:
        data = {"username": username, "error": "Already Registered"}
    return JsonResponse(data)


def get_request_details(url,domain):
    return DOMAINS[domain][url], DOMAINS[domain]['headers']


def format_product_url(url, query, page, country):
    return url\
        .replace('$QUERY', query)\
        .replace('$PAGE', str(page))\
        .replace('$COUNTRY', country)


def format_review_url(url, asin, country):
    return url\
        .replace('$ASIN', asin)\
        .replace('$COUNTRY', country)

def handle_api_request(url, headers):
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json().get('data', {})
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching data from {url}: {e}")
        return []


def fetch_amazon_products(query):
    products = []
    domain = "amazon"
    template_url, headers = get_request_details('product_url', domain)
    for tld in DOMAINS[domain]['TLDs']:
        logger.info(f"Fetching {query} products from {domain}.{tld}...")
        page = 1
        
        num_of_products = 0
        while True:
            formatted_url = format_product_url(template_url, query, page, tld)
            fetched_products = handle_api_request(formatted_url, headers).get('products', [])

            if not fetched_products:
                break
            
            for product in fetched_products:
                # if product['product_title'] and product['product_price'] and product['currency']:
                product['product_brand'] = query
                product['product_title'] = product['product_title'].replace(query, "").strip()
                product['country'] = tld
                products.append(product)
            page += 1
            # For Test purposes (Not to overload bq initially)
            if page == 2:
                break
            
    return products


def publish_to_bigquery(data, endpoint):
    try:
        url = "http://localhost:3030" + endpoint
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
        data += fetch_amazon_products(query)

    if data:
        logger.info(f"{len(data)} products fetched")
        endpoint = "/load_products"
        publish_to_bigquery(data,endpoint)
    else:
        return JsonResponse({'status': 500, 'error': 'Failed to fetch products'})
    return JsonResponse({'status': 200, 'message': 'Products loaded to BigQuery successfully'})
    

def get_reviews_v2(request):
    data = []
    asin = request.GET.get('asin', '')
    country = request.GET.get('country', '')
    if asin != '' and country != '':
        endpoint = '/reviews/' + asin
        reviews = get_request(endpoint)
        if reviews:
            return JsonResponse({'status': 200, 'data': reviews})
        else:
            url, headers = get_request_details('review_url','amazon')
            url = url.replace('$ASIN', asin).replace('$COUNTRY', country)
            try:
                data = handle_api_request(url, headers).get('reviews',[])
                if data:
                    logger.info(f"{len(data)} reviews fetched")
                    endpoint = "/load_reviews"
                    publish_to_bigquery(data,endpoint)
                    return JsonResponse({'status': 200, 'data': data})
                return JsonResponse({'status': 404, 'message': 'Not found'})
            except AttributeError as err:    
                return JsonResponse({'status': 400, 'message': 'AttributeException'})
    logger.critical(f"ASIN={asin} // COUNTRY={country}")
    return JsonResponse({'status': 400, 'message': 'ASIN & COUNTRY Error'})


def get_products(request):
    endpoint = "/products"
    products = get_request(endpoint)["products"]
    return JsonResponse({'status': 200, 'products': products})


def get_product(request, asin):
    if asin:
        endpoint = "/product/" + str(asin)
        product = get_request(endpoint)
        return JsonResponse({'status': 200, 'product': product})
    return JsonResponse({'status': 500, 'error': 'assin error'})


@csrf_exempt
def google_login_token(request):
    print("GOOGLE_LOGIN_TOKEN Invoked")
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            print(f"Body: {body}")
            token = body.get('token')

            print("Verifying token")
            # Verify the token with Google's servers
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)

            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')

            # Get user info from the token
            google_id = idinfo['sub']
            email = idinfo['email']
            print(f"Email: {email}")
            first_name = idinfo.get('given_name', '')
            print(f"First Name: {first_name}")
            last_name = idinfo.get('family_name', '')
            print(f"Last Name: {last_name}")

            # Check if the user already exists
            user, created = User.objects.get_or_create(
                email=email,
                defaults={'username': email, 'first_name': first_name, 'last_name': last_name}
            )
            print(f"User: {user}, Created: {created}")

            # Specify the backend and log the user in
            user.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, user)
            print("User logged in")

            return JsonResponse({'status': 'Authenticated', "username": user.email})

        except ValueError as ve:
            print(f"ValueError: {ve}")
            return JsonResponse({'status': 'Error', 'message': 'Invalid token'}, status=400)
        except Exception as e:
            print(f"Exception: {e}")
            return JsonResponse({'status': 'Error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'Error', 'message': 'Invalid request'}, status=400)

