"""urls.py import statements"""
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

APP_NAME = 'djangoapp'
urlpatterns = [
    # path for home
    path(route='', view=views.home, name='home'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
