from django.contrib import admin
from .models import author, library, member, book, borrow

# Register your models here.

admin.site.register(author)
admin.site.register(library)
admin.site.register(member)
admin.site.register(book)
admin.site.register(borrow)