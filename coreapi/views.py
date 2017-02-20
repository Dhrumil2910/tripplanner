from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework import permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response

from coreapi.models import Trip
from coreapi.serializers import TripSerializer, UserSerializer
from coreapi.permissions import IsOwner, IsAdmin, IsStaff


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


class UserList(generics.ListCreateAPIView):
    permission_classes = (IsStaff,)
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsStaff,)
    queryset = User.objects.all()
    serializer_class = UserSerializer


class StaffList(generics.ListCreateAPIView):
    permission_classes = (IsAdmin,)
    queryset = User.objects.filter(is_staff=True)
    serializer_class = UserSerializer


class StaffDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAdmin,)
    queryset = User.objects.filter(is_staff=True)
    serializer_class = UserSerializer


class TripListAdmin(generics.ListCreateAPIView):
    permissions = (IsAdmin,)
    queryset = Trip.objects.all()
    serializer_class = TripSerializer


class TripDetailAdmin(generics.RetrieveUpdateDestroyAPIView):
    permissions = (IsAdmin,)
    queryset = Trip.objects.all()
    serializer_class = TripSerializer


@api_view(['GET'])
def isUserAuthenticated(request):
    return Response(bool(request.user.is_authenticated))

@api_view(['GET'])
def userMetaInfo(request):
    usertype = 'anonymous'
    if request.user.is_authenticated:
        if request.user.is_superuser:
            usertype = 'admin'
        elif request.user.is_staff:
            usertype = 'staff'
        else:
            usertype = 'user'


    return Response({
        'userType': usertype,
        'userName': request.user.username,
    })
