import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = ')za3dvh3bxpouvy^hoc2hixu-w+4fn8@_shlksgf!p&@5^a^3n'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'djangoapp.apps.DjangoappConfig',
    'django.contrib.sites',  # Required for allauth
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',  # Google OAuth provider
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    "allauth.account.middleware.AccountMiddleware"
]

SITE_ID = 1

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)

LOGIN_REDIRECT_URL = '/'

# CORS_ALLOW_ALL_ORIGINS = True # If this is used then `CORS_ALLOWED_ORIGINS` will not have any effect

CORS_ALLOWED_ORIGINS = ['http://localhost:3000']

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = ['http://localhost', 'http://127.0.0.1', 'http://localhost:3000']

ROOT_URLCONF = 'djangoproj.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            # os.path.join(BASE_DIR, 'frontend/static'),
            os.path.join(BASE_DIR, 'frontend/build'),
            os.path.join(BASE_DIR, 'frontend/build/static'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'djangoproj.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
MEDIA_ROOT = os.path.join(STATIC_ROOT, 'media')
MEDIA_URL = '/media/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

STATICFILES_DIRS = [
    # os.path.join(BASE_DIR, 'frontend/static'),
    os.path.join(BASE_DIR, 'frontend/build'),
    os.path.join(BASE_DIR, 'frontend/build/static'),
]


# GLOBAL DICTIONARY
DOMAINS = {
        'amazon': {
            'TLDs': ['TR'],  # ['US', 'AU', 'BR', 'CA', 'CN', 'FR', 'DE', 'IN', 'IT', 'MX', 'NL', 'SG', 'ES', 'TR', 'AE', 'GB', 'JP', 'SA', 'PL', 'SE', 'BE', 'EG'],
            'product_url': 'https://real-time-amazon-data.p.rapidapi.com/search?query=$QUERY&page=$PAGE&country=$COUNTRY&sort_by=RELEVANCE&product_condition=ALL',
            'review_url': 'https://real-time-amazon-data.p.rapidapi.com/product-reviews?asin=$ASIN&country=$COUNTRY&sort_by=TOP_REVIEWS&star_rating=ALL&verified',
            'headers': {
                'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com',
                'x-rapidapi-key': '1276d4083bmshf31783a6f78a32dp1b9327jsn5273120b5da9',
                }
        }
    }
