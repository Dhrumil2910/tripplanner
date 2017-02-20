from __future__ import unicode_literals
from django.db import models
from django.core.validators import ValidationError


class Trip(models.Model):
    owner = models.ForeignKey('auth.User', related_name='owner',
                                on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    # start_place = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    comment = models.CharField(max_length=200, blank=True)
    mode = models.CharField(choices=(
        ("car", "car"),
        ("bus", "bus"),
        ("plane", "plane"),
        ("bicycle", "bicycle"),
    ), max_length=7)

    def __str__(self):
        return "To %s from %s to %s" % (self.destination,
            self.start_date, self.end_date)

    class Meta:
        get_latest_by = "start_date"
