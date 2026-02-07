from rest_framework import viewsets
from .models import author, library, member, book, borrow
from .serializers import AuthorSerializer, LibrarySerializer, MemberSerializer, BookSerializer, BorrowSerializer

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = author.objects.all()
    serializer_class = AuthorSerializer

class LibraryViewSet(viewsets.ModelViewSet):
    queryset = library.objects.all()
    serializer_class = LibrarySerializer

class MemberViewSet(viewsets.ModelViewSet):
    queryset = member.objects.all()
    serializer_class = MemberSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = book.objects.all()
    serializer_class = BookSerializer

class BorrowViewSet(viewsets.ModelViewSet):
    queryset = borrow.objects.all()
    serializer_class = BorrowSerializer