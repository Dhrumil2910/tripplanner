from django.contrib.auth.models import User
from rest_framework import serializers

from coreapi.models import Trip


class UserSerializer(serializers.ModelSerializer):
    # trips = serializers.PrimaryKeyRelatedField(many=True,
    #             queryset=Trip.objects.all())

    class Meta:
        model = User
        fields = ('id', 'password', 'first_name', 'last_name', 'username', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(
            **validated_data
        )
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        if validated_data.has_key('password'):
            password = validated_data.pop('password')
        else:
            password = None

        for key, value in validated_data.iteritems():
            setattr(instance, key, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance


class TripSerializer(serializers.ModelSerializer):
    start_date = serializers.DateTimeField(input_formats=(['%Y/%m/%d %H:%M', 'iso-8601']),
                                            format='%Y/%m/%d %H:%M')
    end_date = serializers.DateTimeField(input_formats=(['%Y/%m/%d %H:%M', 'iso-8601']),
                                            format='%Y/%m/%d %H:%M')
    owner = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='username',
        required=False
    )

    class Meta:
        model = Trip
        fields = ('owner', 'id', 'start_date', 'end_date', 'destination',
                'comment', 'mode')

    def validate(self, data):
        def is_trip_clashing(start, end, owner):
            trips = Trip.objects.filter(owner=owner)
            if self.instance is not None:
                trips = trips.exclude(id=self.instance.id)
            for trip in trips:
                if ((trip.start_date >= start and trip.start_date <= end) or
                    (trip.end_date >= start and trip.end_date <= end) or
                    (trip.start_date <= start and trip.end_date >= end)):
                    raise serializers.ValidationError("Trip clashing with other trips")

        try:
            if data['start_date'] > data['end_date']:
                raise serializers.ValidationError("End date must be after start date")

            is_trip_clashing(data['start_date'], data['end_date'], self.context['request'].user)

        except KeyError:
            pass

        return data
