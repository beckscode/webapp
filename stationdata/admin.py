from django.contrib import admin
from .models import Author, Genre, Book, BookInstance, Station, GUI_Style, API_Key

# Register your models here. Practice data.
#admin.site.register(Book)
#admin.site.register(Author)
admin.site.register(Genre)
#admin.site.register(BookInstance)
admin.site.register(Station)
admin.site.register(API_Key)
admin.site.register(GUI_Style)


class AuthorAdmin(admin.ModelAdmin):
	list_display = ('last_name', 'first_name', 'date_of_birth', 'date_of_death')
	#pass
	
admin.site.register(Author, AuthorAdmin)	



@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
	pass
	
@admin.register(BookInstance)
class BookInstanceAdmin(admin.ModelAdmin):
	pass

#create super user(practice data), username = username, password = password, email = password@gmail.com. cli python3 manage.py createsuperuser
