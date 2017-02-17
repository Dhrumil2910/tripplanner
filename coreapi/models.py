from __future__ import unicode_literals

from django.db import models


class Trip(models.Model):
    owner = models.ForeignKey('auth.User', related_name='trips',
                                on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    start_place = models.CharField(max_length=100)
    end_place = models.CharField(max_length=100)
    comment = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return "%s to %s from %s to %s" % (self.start_place, self.end_place,
            self.start_date, self.end_date)

    class Meta:
        get_latest_by = "start_date"
