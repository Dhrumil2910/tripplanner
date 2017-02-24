from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.routers import DefaultRouter

from coreapi import views, views_devs


router = DefaultRouter()
router.register(r'trips', views.TripViewSet, base_name='trip')
router.register(r'devs/users', views_devs.UserViewSet, base_name='dev/users')
router.register(r'devs/trips', views_devs.TripViewSet, base_name='dev/trips')
urlpatterns = router.urls

urlpatterns += [
    url(r'^user/$', views.user_details),
]

urlpatterns += [
    url(r'^auth/', include('rest_framework_social_oauth2.urls')),
    url(r'^auth/', include('social_django.urls', namespace='social'))
]

urlpatterns += [
    url(r'^register/', views.register)
]

# urlpatterns += [
#     url(r'^api-auth/', include('rest_framework.urls',
#                                namespace='rest_framework')),
# ]

# urlpatterns = format_suffix_patterns(urlpatterns)
