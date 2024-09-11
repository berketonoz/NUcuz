import os
import requests
from django.http import JsonResponse
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030")

def get_request(endpoint, **kwargs):
    """get_request function for handling the get endpoints and api requests"""
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params += key+"=" + value + "&"

    request_url = backend_url + endpoint + "?" + params

    print(f"GET from {request_url} ")
    try:
        # Call get method of requests library with URL and parameters
        return requests.get(request_url).json()
    except ConnectionError as e:
        # If any error occurs
        print("Network exception occurred -> ", e)
        return JsonResponse({"status": 400, "message": e})