from django.db import models

# Create your models here.
class author(models.Model):
    fullname = models.CharField(max_length=50)


class library(models.Model):
    name = models.CharField(max_length=50)

class member(models.Model):
    fullname = models.CharField(max_length=50)

class book(models.Model):
    author = models.ForeignKey(author, on_delete=models.CASCADE)
    library = models.ForeignKey(library, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)

class borrow(models.Model):
    member = models.ForeignKey(member, on_delete=models.CASCADE)
    book = models.ForeignKey(book, on_delete=models.CASCADE)
    borrowdate = models.DateField(null=True, blank=True)
    returndate = models.DateField(null=True, blank=True)
