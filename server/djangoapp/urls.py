"""urls.py import statements"""
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

APP_NAME = 'djangoapp'
urlpatterns = [
    # paths for bulk load
    path(route='load_products', view=views.load_amazon_products, name='load_amazon_products'),
    
    # paths for user operations
    path(route='logout', view=views.logout_request, name='logout'),
    path(route='login', view=views.login_view, name='login'),
    path(route='register', view=views.registration, name='register'),

    # paths for product
    path(route='products', view=views.get_products, name='get_products'),
    path(route='product/<str:asin>', view=views.get_product, name='get_product'),
    
    # path for reviews !(!asin and country needed in request body!)!
    path(route='reviews', view=views.get_reviews_v2, name='get_reviews'),
    
    path('accounts/google/login/token/', view=views.google_login_token, name='google-login-token'),



] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
