from collections import defaultdict
from django.contrib.auth.models import User
from django.utils.datastructures import MultiValueDictKeyError
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import detail_route, list_route
from rest_framework.filters import SearchFilter

from coreapi.models import Trip
from coreapi.serializers import TripSerializer, UserSerializer
from coreapi.permissions import IsAdmin, IsStaff


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = (IsStaff,)
    serializer_class = UserSerializer
    filter_backends = (SearchFilter,)
    search_fields = ('email', 'username')

    def get_queryset(self):
        if self.request.user.is_superuser:
            return User.objects.all()
        return User.objects.exclude(is_staff=True)

    def list(self, request):
        queryset = self.get_queryset()

        params = defaultdict(lambda: False, request.query_params)

        if params['search']:
            queryset = self.filter_queryset(queryset)
        else:
            is_staff = (params['staff'] == ["true"])
            queryset = queryset.filter(is_staff=is_staff)

        serializer = self.get_serializer_class()(queryset, many=True)
        return Response(serializer.data)

    @detail_route(methods=['get'], permission_classes=[IsAdmin])
    def trips(self, request, pk=None):
        trips = Trip.objects.filter(owner=pk).order_by('-created')

        # page = self.paginate_queryset(recent_trips)
        # if page is not None:
        #     serializer = TripSerializer(page, many=True)
        #     return self.get_paginated_response(serializer.data)

        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)


class TripViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAdmin,)
    serializer_class = TripSerializer
    queryset = Trip.objects.all().order_by('-created')
    filter_backends = (SearchFilter,)
    search_fields = ('destination', 'comment', 'mode', 'owner__username')
