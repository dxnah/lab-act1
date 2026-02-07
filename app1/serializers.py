from rest_framework import serializers
from .models import author, library, member, book, borrow

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = author
        fields = ['id', 'fullname']

class LibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = library
        fields = ['id', 'name']

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = member
        fields = ['id', 'fullname']

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = book
        fields = ['id', 'author', 'library', 'title']

class BorrowSerializer(serializers.ModelSerializer):
    class Meta:
        model = borrow
        fields = ['id', 'member', 'book', 'borrowdate', 'returndate']