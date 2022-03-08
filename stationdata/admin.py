from django.contrib import admin
from .models import Author, Genre, Book, BookInstance

# Register your models here. Practice data.
admin.site.register(Book)
admin.site.register(Author)
admin.site.register(Genre)
admin.site.register(BookInstance)

#create super user(practice data), username = username, password = password, email = password@gmail.com. cli python3 manage.py createsuperuser
