from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

    def has_permission(self, request, view):
        return request.user.is_authenticated


class IsAdmin(permissions.BasePermission):
    """
    Custom permission to allow only admin to access the view.
    """
    def has_permission(self, request, view):
        return request.user.is_superuser


class IsStaff(permissions.BasePermission):
    """
    Custom permission to allow only staff members to access the view.
    """
    def has_permission(self, request, view):
        return request.user.is_staff
