from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthorViewSet, LibraryViewSet, MemberViewSet, BookViewSet, BorrowViewSet

router = DefaultRouter()
router.register(r'authors', AuthorViewSet, basename='author')
router.register(r'libraries', LibraryViewSet, basename='library')
router.register(r'members', MemberViewSet, basename='member')
router.register(r'books', BookViewSet, basename='book')
router.register(r'borrows', BorrowViewSet, basename='borrow')

urlpatterns = [
    path('', include(router.urls)),
]