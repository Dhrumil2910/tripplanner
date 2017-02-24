from django.conf.urls import url
from webapp.views import login, index, terminate, admin

urlpatterns = [
    url(r'^login$', login),
    url(r'^$', index),
    url(r'^terminate$', terminate),
    url(r'^dev/$', admin),
]