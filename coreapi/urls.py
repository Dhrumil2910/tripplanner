from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from coreapi import views

urlpatterns = [
    url(r'^trips/$', views.TripList.as_view()),
    url(r'^trips/(?P<pk>[0-9]+)/$', views.TripDetail.as_view()),
    url(r'^users/$', views.UserList.as_view()),
    url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
]

urlpatterns += [
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='rest_framework')),
]

urlpatterns = format_suffix_patterns(urlpatterns)
