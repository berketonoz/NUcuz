"""urls.py import statements"""
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

APP_NAME = 'djangoapp'
urlpatterns = [
    # path for home
    path(route='load_amazon', view=views.load_amazon_products, name='load_amazon_products'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
