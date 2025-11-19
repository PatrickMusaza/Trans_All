from django.db import models
from django.contrib.auth.models import AbstractUser

# Extend User model
class User(AbstractUser):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('client', 'Client'),
        ('driver', 'Driver'),
        ('staff', 'Staff'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    age = models.IntegerField(null=True, blank=True, default=0)
    street_number = models.CharField(max_length=50)
    sector = models.CharField(max_length=50)
    district = models.CharField(max_length=50)
    password=models.CharField(max_length=300,default="pbkdf2_sha256$870000$LhE324Wo9VX2CzAf6uTwdK$GOdkTNB6mK6Oa3zXJHpYV5u1vKknKFluau7QgiyZmsM=")

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

class Agency(models.Model):
    agency_name = models.CharField(max_length=100)
    number_of_vehicles = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

class Route(models.Model):
    from_place = models.CharField(max_length=100)
    to_place = models.CharField(max_length=100)
    distance = models.FloatField()

class Vehicle(models.Model):
    license_plate = models.CharField(max_length=50, unique=True)
    lat = models.CharField(max_length=50)
    log = models.CharField(max_length=50)
    number_of_seats = models.IntegerField()
    passengers = models.IntegerField(blank=True,default=0)
    buy_time = models.DateTimeField(auto_now_add=True)

class Trip(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='trips')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='trips')
    driver = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'driver'})
    date = models.DateField()
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    agency = models.CharField(max_length=100)
    status = models.CharField(max_length=100)

class Order(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'client'})
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE)
    order_time = models.DateTimeField(auto_now_add=True)

class Ride(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='rides')
    ride_time = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=150)
    category = models.CharField(max_length=150)
    message = models.TextField()
    phone = models.TextField()
    status = models.BooleanField(auto_created=False,default=False)
    sent_at = models.DateTimeField(auto_now_add=True)

class Controlled(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    staff = models.ForeignKey(User, limit_choices_to={'role': 'staff'}, on_delete=models.CASCADE)
    work_hour = models.IntegerField()
    controlled_at = models.DateTimeField(auto_now_add=True)

class Moved(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    speed = models.FloatField()
    moved_at = models.DateTimeField(auto_now_add=True)

class Located(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE)
