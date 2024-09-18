from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('djangoapp/', include('djangoapp.urls')),
    path('accounts/', include('allauth.urls')),  # Allauth for social login

    # Home Route
    path('', TemplateView.as_view(template_name="index.html")),
    
    #Routes
    path('products/', TemplateView.as_view(template_name="index.html")),
    path('product/<str:asin>', TemplateView.as_view(template_name="index.html")),
    path('login/', TemplateView.as_view(template_name="index.html")),
    path('register/', TemplateView.as_view(template_name="index.html")),



]
