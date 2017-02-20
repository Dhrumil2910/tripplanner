from django.contrib.auth.models import User
from rest_framework import serializers

from coreapi.models import Trip


class TripSerializer(serializers.ModelSerializer):
    start_date = serializers.DateTimeField(input_formats=(['%Y/%m/%d %H:%M', 'iso-8601']),
                                            format='%Y/%m/%d %H:%M')
    end_date = serializers.DateTimeField(input_formats=(['%Y/%m/%d %H:%M', 'iso-8601']),
                                            format='%Y/%m/%d %H:%M')
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Trip
        fields = ('owner', 'id', 'start_date', 'end_date', 'destination',
                'comment', 'mode')

    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("finish must occur after start")

        return data


class UserSerializer(serializers.ModelSerializer):
    # trips = serializers.PrimaryKeyRelatedField(many=True,
    #             queryset=Trip.objects.all())

    class Meta:
        model = User
        fields = ('id', 'password', 'first_name', 'last_name', 'username', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            username = validated_data['username'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name'],
            email = validated_data['email'],

        )
        user.set_password(validated_data['password'])
        user.save()
        return user
