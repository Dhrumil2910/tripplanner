from django.contrib.auth.models import User
from rest_framework import serializers

from coreapi.models import Trip


class TripSerializer(serializers.ModelSerializer):
    # start_date = serializers.DateTimeField(input_formats=(['%d/%m/%Y %I:%M %p', 'iso-8601']))
    # end_date = serializers.DateTimeField(input_formats=(['%d/%m/%Y %I:%M %p', 'iso-8601']))
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Trip
        fields = ('owner', 'id', 'start_date', 'end_date', 'start_place',
            'end_place', 'comment')


class UserSerializer(serializers.ModelSerializer):
    trips = serializers.PrimaryKeyRelatedField(many=True,
                queryset=Trip.objects.all())

    class Meta:
        model = User
        fields = ('id', 'username', 'trips')
