# SWM__APP/backend/api/permissions.py
from rest_framework import permissions  # Add this import

class IsClerkOrAbove(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.user_role in ['Clerk', 'Manager', 'Admin']

class IsManagerOrAbove(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_role in ['Manager', 'Admin']

class IsDriver(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_role == 'Driver'

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user_id == request.user.user_id or request.user.user_role == 'Admin'

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_role == 'Admin'
    
# api/permissions.py
class IsDashboardUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_role in [
            'Admin', 'Clerk', 'Manager', 'Driver', 'Resident'
        ]

class IsManagerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.user_role in ['Manager', 'Admin']
        )