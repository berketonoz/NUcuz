from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('djangoapp/', include('djangoapp.urls')),

    # Home Route
    path('', TemplateView.as_view(template_name="index.html")),
    
    #Products Route
    path('products/', TemplateView.as_view(template_name="index.html"))

]
