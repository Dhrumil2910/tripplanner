from django.contrib import admin

from coreapi.models import Trip


class TripAdmin(admin.ModelAdmin):
    pass

admin.site.register(Trip, TripAdmin)
