from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from coreapi import views

urlpatterns = [
    url(r'^trips/$', views.TripList.as_view()),
    url(r'^trips/(?P<pk>[0-9]+)/$', views.TripDetail.as_view()),
    url(r'^user/$', views.isUserAuthenticated),
    url(r'^user/info', views.userMetaInfo),
    url(r'^admin/users/$', views.UserList.as_view()),
    url(r'^admin/users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
    url(r'^admin/staff/$', views.StaffList.as_view()),
    url(r'^admin/staff/(?P<pk>[0-9]+)/$', views.StaffDetail.as_view()),
    url(r'^admin/trips/$', views.TripListAdmin.as_view()),
    url(r'^admin/trips/(?P<pk>[0-9]+)/$', views.TripDetailAdmin.as_view()),
]

# urlpatterns += [
#     url(r'^api-auth/', include('rest_framework.urls',
#                                namespace='rest_framework')),
# ]

urlpatterns += [
    url(r'^auth/', include('rest_framework_social_oauth2.urls')),
    url(r'^auth/', include('social_django.urls', namespace='social'))
]

urlpatterns = format_suffix_patterns(urlpatterns)
