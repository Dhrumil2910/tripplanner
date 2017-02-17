from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework import permissions

from coreapi.models import Trip
from coreapi.serializers import TripSerializer
from coreapi.serializers import UserSerializer
from coreapi.permissions import IsOwner


class TripList(generics.ListCreateAPIView):
    serializer_class = TripSerializer
    permission_classes = (IsOwner,)

    def get_queryset(self):
        """
        Return queryset for the current user.
        """
        user = self.request.user
        return Trip.objects.filter(owner=user.id)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TripDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TripSerializer
    permission_classes = (IsOwner,)

    def get_queryset(self):
        """
        Return queryset for the current user.
        """
        user = self.request.user
        return Trip.objects.filter(owner=user.id)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
