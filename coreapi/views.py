from django.contrib.auth.models import User
from django.utils.datastructures import MultiValueDictKeyError
from rest_framework import viewsets
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from rest_framework import status

from coreapi.models import Trip
from coreapi.serializers import TripSerializer, UserSerializer
from coreapi.permissions import IsOwner
from coreapi.throttles import RegistrationBurstRateThrottle, RegistrationSustainedRateThrottle


class TripViewSet(viewsets.ModelViewSet):
    serializer_class = TripSerializer
    permission_classes = (IsOwner,)
    filter_backends = (SearchFilter,)
    search_fields = ('destination', 'comment', 'mode', 'owner__username')

    def get_queryset(self):
        """
        Return queryset for the current user.
        """
        user = self.request.user
        return Trip.objects.filter(owner=user.id).order_by('-created')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


@api_view(['GET'])
def user_details(request):
    authenticated = bool(request.user.is_authenticated)

    if authenticated:
        if request.user.is_superuser:
            user_type = 'admin'
        elif request.user.is_staff:
            user_type = 'staff'
        else:
            user_type = 'user'
    else:
        user_type = 'anonymous'

    data = {
        'authenticated': authenticated,
        'userType': user_type,
        'userName': request.user.username,
    }

    try:
        if request.query_params['detailed'] == "true":
            data.update(get_detailed_info(request.user))
    except MultiValueDictKeyError:
        pass

    return Response(data)


def get_detailed_info(user):
    return {}


@api_view(['POST'])
@throttle_classes([RegistrationBurstRateThrottle, RegistrationSustainedRateThrottle])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
