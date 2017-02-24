import datetime

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from django.contrib.auth.models import User

from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework.test import APITestCase, APIClient
import oauth2_provider.models as oauth_models

from coreapi.models import Trip
from coreapi.serializers import UserSerializer, TripSerializer
from coreapi.tests.utils import BaseTest


class TripTestAdmin(BaseTest):
    def test_get(self):
        user = self.admin_user
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + user.access_token.token)

        response = self.client.get('/api/v1/devs/trips/')
        trips = Trip.objects.all()
        assert self.are_equal(trips, response.data)

        self.client.credentials()

    def test_post(self):
        user = self.admin_user
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + user.access_token.token)

        data = {
            "start_date": "2018/03/20 16:59",
            "end_date": "2018/06/20 15:40",
            "destination": "Paris",
            "comment": "Yayy!",
            "mode": "plane",
            "owner": "user",
        }

        response = self.client.post('/api/v1/devs/trips/', data, format="json")
        try:
            Trip.objects.get(id=response.data['id'])
        except DoesNotExist:
            assert False

        response.data.pop('id')
        assert data == response.data

        self.client.credentials()

    def test_patch(self):
        user = self.admin_user
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + user.access_token.token)

        data = {
            "mode": "bus",
        }

        trip = Trip.objects.all()[0]
        response = self.client.patch('/api/v1/devs/trips/%s/' % (trip.id), data, format="json")

        try:
            trip = Trip.objects.get(id=trip.id)
            assert trip.mode == data["mode"]
        except DoesNotExist:
            assert False


        self.client.credentials()

    def test_delete(self):
        user = self.admin_user
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + user.access_token.token)

        trip = Trip.objects.all()[0]
        response = self.client.delete('/api/v1/trips/devs/%s/' % (trip.id))

        try:
            Trip.objects.get(id=trip.id)
            assert False
        except:
            assert True

        self.client.credentials()

class UserTest(BaseTest):
    def test_get_admin(self):
        user = self.admin_user
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + user.access_token.token)

        response = self.client.get('/api/v1/devs/users/')
        users = User.objects.filter(is_staff=False)
        assert self.are_equal(users, response.data)

        response = self.client.get('/api/v1/devs/users/?staff=true')
        users = User.objects.filter(is_staff=True)
        assert self.are_equal(users, response.data)

        self.client.credentials()

    def test_get_staff(self):
        user = self.staff_user
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + user.access_token.token)

        response = self.client.get('/api/v1/devs/users/')
        users = User.objects.filter(is_staff=False)
        assert self.are_equal(users, response.data)
        self.client.credentials()

    def test_post(self):
        user = self.staff_user
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + user.access_token.token)

        data = {
            "username": "newuser",
            "password": "password",
        }

        response = self.client.post('/api/v1/devs/users/', data, format="json")
        try:
            User.objects.get(id=response.data['id'])
        except DoesNotExist:
            assert False

        self.client.credentials()

    def test_patch(self):
        user = self.admin_user
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + user.access_token.token)

        data = {
            "username": "changedname",
        }

        user = User.objects.all()[0]
        response = self.client.patch('/api/v1/devs/users/%s/' % (user.id), data, format="json")

        try:
            user = User.objects.get(id=user.id)
            assert user.username == data["username"]
        except DoesNotExist:
            assert False


        self.client.credentials()

    def test_delete(self):
        user = self.staff_user
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + user.access_token.token)

        user = User.objects.all()[0]
        response = self.client.delete('/api/v1/users/devs/%s/' % (user.id))

        try:
            User.objects.get(id=user.id)
            assert False
        except:
            assert True

        self.client.credentials()
