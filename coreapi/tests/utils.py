import datetime
from collections import defaultdict
import os
import binascii
import random

from django.utils import timezone
from django.contrib.auth.models import User

from rest_framework.test import APITestCase

import oauth2_provider.models as oauth_models

from coreapi.serializers import UserSerializer, TripSerializer


class BaseTest(APITestCase):
    def setUp(self):
        """
        - Create admin, staff, simple user
        - Create oauth2_provider.models.Application
        - Create oauth2_provider.models.AccessToken
        """
        # Create test users
        def create_user(data):
            data = defaultdict(lambda: False, data)

            is_superuser = data['is_superuser']
            is_staff = data['is_staff']

            if is_superuser:
                is_staff = True

            serializer = UserSerializer(data=data)
            if serializer.is_valid():
                user = serializer.save()
                user.is_staff = is_staff
                user.is_superuser = is_superuser
                user.save()
                return user
            else:
                raise

        def create_random_normal_users(count=10):
            usernames = set()
            while len(usernames) < count:
                usernames.add(str(random.randint(10000, 100000)))

            users = []
            for i in xrange(count):
                users.append(create_user({
                    "username": usernames.pop(),
                    "password": "123456",
                }))

            return users

        def create_random_trip(user):
            data = {
                "start_date": "2017/03/20 16:59",
                "end_date": "2017/06/20 15:40",
                "destination": "Paris",
                "comment": "Yayy!",
                "mode": "plane",
                "owner": user,
            }
            serializer = TripSerializer(data=data)
            if serializer.is_valid():
                return serializer.save()
            raise


        self.admin_user = create_user({
            "username": "admin",
            "password": "123456",
            "is_superuser": True,
        })

        self.staff_user = create_user({
            "username": "staff",
            "password": "123456",
            "is_staff": True,
        })

        self.normal_user = create_user({
            "username": "user",
            "password": "123456",
        })

        # self.users = [self.admin_user, self.staff_user, self.normal_user]
        # self.users += create_random_normal_users(count=2)

        # self.trips = []
        for user in User.objects.all():
            create_random_trip(user)

        # Create application
        self.application = oauth_models.Application(
            name="Test Application",
            redirect_uris="http://localhost http://example.com http://example.it",
            user=self.admin_user,
            client_type=oauth_models.Application.CLIENT_CONFIDENTIAL,
            authorization_grant_type=oauth_models.Application.GRANT_AUTHORIZATION_CODE,
        )
        self.application.save()

        # Create Access Tokens
        def create_token(user):
            token = oauth_models.AccessToken.objects.create(
                user=user,
                token=binascii.b2a_hex(os.urandom(15)),
                # application=oauth_models.Application.objects.get(name="Testing"),
                application=self.application,
                expires=timezone.now() + datetime.timedelta(days=1)
            )
            return token

        self.admin_user.access_token = create_token(self.admin_user)
        self.staff_user.access_token = create_token(self.staff_user)
        self.normal_user.access_token = create_token(self.normal_user)


    def tearDown(self):
        self.application.delete()

        self.admin_user.delete()
        self.normal_user.delete()
        self.staff_user.delete()

    def to_queryset(self, model, items):
        return model.objects.filter(id__in=[item.id for item in items])

    def are_equal(self, items_queryset, items_list):
        ids = [item['id'] for item in items_list]
        ids = list(set(ids))

        if len(ids) != len(items_queryset):
            return False

        for item_id in ids:
            try:
                items_queryset.get(id=item_id)
            except DoesNotExist:
                return False

        return True
