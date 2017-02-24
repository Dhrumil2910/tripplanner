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


class AccessibilityTest(BaseTest):
    def check_accessibility(self, status):
        endpoints = [
            '/api/v1/devs/users/',
            '/api/v1/devs/trips/',
            '/api/v1/trips/',
        ]

        for endpoint in endpoints:
            response = self.client.get(endpoint)
            self.assertEqual(response.status_code, status)

    def test_admin_user(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.admin_user.access_token.token)
        self.check_accessibility(200)
        self.client.credentials()

    def test_normal_user(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.normal_user.access_token.token)

        endpoint = '/api/v1/devs/users/'
        response = self.client.get(endpoint)
        self.assertEqual(response.status_code, 403)


        endpoint = '/api/v1/devs/trips/'
        response = self.client.get(endpoint)
        self.assertEqual(response.status_code, 403)

        endpoint = '/api/v1/trips/'
        response = self.client.get(endpoint)
        self.assertEqual(response.status_code, 200)

        self.client.credentials()

    def test_staff_user(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.admin_user.access_token.token)
        self.check_accessibility(200)
        self.client.credentials()

    def test_anon_user(self):
        self.check_accessibility(401)


class TripTest(BaseTest):
    def test_get(self):
        user = self.normal_user
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + user.access_token.token)

        response = self.client.get('/api/v1/trips/')
        trips = Trip.objects.filter(owner=user)
        assert self.are_equal(trips, response.data)

        self.client.credentials()

    def test_post(self):
        user = self.normal_user
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + user.access_token.token)

        data = {
            "start_date": "2018/03/20 16:59",
            "end_date": "2018/06/20 15:40",
            "destination": "Paris",
            "comment": "Yayy!",
            "mode": "plane",
            "owner": user.username,
        }

        response = self.client.post('/api/v1/trips/', data, format="json")
        try:
            Trip.objects.get(id=response.data['id'])
        except DoesNotExist:
            assert False

        response.data.pop('id')
        assert data == response.data

        self.client.credentials()

    def test_patch(self):
        user = self.normal_user
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + user.access_token.token)

        data = {
            "mode": "bus",
        }

        trip = Trip.objects.filter(owner=user)[0]
        response = self.client.patch('/api/v1/trips/%s/' % (trip.id), data, format="json")

        try:
            trip = Trip.objects.get(id=trip.id)
            assert trip.mode == data["mode"]
        except DoesNotExist:
            assert False


        self.client.credentials()

    def test_delete(self):
        user = self.normal_user
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + user.access_token.token)

        trip = Trip.objects.filter(owner=user)[0]
        response = self.client.delete('/api/v1/trips/%s/' % (trip.id))

        try:
            Trip.objects.get(id=trip.id)
            assert False
        except:
            assert True

        self.client.credentials()
