#!/bin/sh

# Make migrations and migrate the database.
echo "Making migrations and migrating the database. "
python manage.py makemigrations
python manage.py migrate
# python manage.py collectstatic
# exec "$@"