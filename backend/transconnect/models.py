from django.db import models
from django.contrib.auth.models import User

class Driver(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    age = models.IntegerField()
    street_number = models.CharField(max_length=50)
    sector = models.CharField(max_length=50)
    district = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

class Client(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    age = models.IntegerField()
    signup_time = models.DateTimeField()

class Staff(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    street_number = models.CharField(max_length=50)
    district = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)


class Route(models.Model):
    from_place = models.CharField(max_length=100)
    to_place = models.CharField(max_length=100)
    distance = models.FloatField()

class Trip(models.Model):
    ride_no = models.CharField(max_length=50)
    date = models.DateField()
    from_place = models.CharField(max_length=100)
    to_place = models.CharField(max_length=100)
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    book_time = models.DateTimeField()
    speed = models.FloatField()
    driver_name = models.CharField(max_length=100)
    agency = models.CharField(max_length=100)
    
class Agency(models.Model):
    agency_name = models.CharField(max_length=100)
    number_of_vehicles = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

class Vehicle(models.Model):
    license_plate = models.CharField(max_length=50)
    number_of_seats = models.IntegerField()
    buy_time = models.DateTimeField()

class Ride(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    ride_time = models.DateTimeField()

class Controlled(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    work_hour = models.IntegerField()
    controlled_at = models.DateTimeField(auto_now_add=True)

class Moved(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    speed = models.FloatField()
    moved_at = models.DateTimeField(auto_now_add=True)

class Order(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    order_time = models.DateTimeField()

class Located(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE)
