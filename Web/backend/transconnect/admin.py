from django.contrib import admin
from .models import User, Route, Agency, Vehicle, Ride, Controlled, Moved, Order, Located,Trip, Message

admin.site.register(User)
admin.site.register(Route)
admin.site.register(Agency)
admin.site.register(Vehicle)
admin.site.register(Ride)
admin.site.register(Controlled)
admin.site.register(Moved)
admin.site.register(Order)
admin.site.register(Located)
admin.site.register(Trip)
admin.site.register(Message)
