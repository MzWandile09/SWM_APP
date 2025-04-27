# api/backends.py

# api/backends.py
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from rest_framework import permissions  # 👈 Add this import

User = get_user_model()

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = User.objects.get(email=username)
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
        except User.DoesNotExist:
            return None
        
class IsManagerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_role in ['Manager', 'Admin']