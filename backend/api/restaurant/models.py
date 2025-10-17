from django.db import models

# Create your models here.
class Restaurant(models.Model):
    name = models.CharField(null=False, unique=True, max_length=20)

class Table(models.Model):
    occupied = models.BooleanField(default=False)
    maxSeats = models.SmallIntegerField(null=False)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, default=1)

class Reservation(models.Model):
    name = models.CharField(null=False, max_length=20)
    phoneNr = models.CharField(null=False, max_length=9)
    date = models.DateTimeField(null =False)
    guestsNr = models.PositiveIntegerField(null=False)
    notes = models.CharField(null=True, blank=True, max_length=150)

    table = models.ManyToManyField(Table)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)

class AdminUser(models.Model):
    name = models.CharField(null=False, max_length=20)
    password = models.CharField(null=False, max_length=20)