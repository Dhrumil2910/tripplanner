from django.conf.urls import url
from webapp.views import login, index, terminate, admin, user_manager, register

urlpatterns = [
    url(r'^login$', login),
    url(r'^$', index),
    url(r'^terminate$', terminate),
    url(r'^admin/$', admin),
    url(r'^manager/$', user_manager),
    url(r'^register$', register),
]
