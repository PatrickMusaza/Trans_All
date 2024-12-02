from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import (
    Driver, Vehicle, Client, Staff, Route, Agency, Ride, Controlled, Moved, Order, Located
)
from .serializers import (
    DriverSerializer, VehicleSerializer, ClientSerializer, UserSerializer, 
    StaffSerializer, RouteSerializer, AgencySerializer, RideSerializer, 
    ControlledSerializer, MovedSerializer, OrderSerializer, LocatedSerializer
)

# User creation
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# Generic View for Model APIs
class GenericListView(APIView):
    model = None
    serializer_class = None
    permission_classes = [IsAuthenticated]

    def get(self, request):
        objects = self.model.objects.all()
        serializer = self.serializer_class(objects, many=True)
        return Response(serializer.data)

# Specific Endpoints
class DriverList(GenericListView):
    model = Driver
    serializer_class = DriverSerializer

class VehicleList(GenericListView):
    model = Vehicle
    serializer_class = VehicleSerializer

class ClientList(GenericListView):
    model = Client
    serializer_class = ClientSerializer

class StaffList(GenericListView):
    model = Staff
    serializer_class = StaffSerializer

class RouteList(GenericListView):
    model = Route
    serializer_class = RouteSerializer

class AgencyList(GenericListView):
    model = Agency
    serializer_class = AgencySerializer

class RideList(GenericListView):
    model = Ride
    serializer_class = RideSerializer

class ControlledList(GenericListView):
    model = Controlled
    serializer_class = ControlledSerializer

class MovedList(GenericListView):
    model = Moved
    serializer_class = MovedSerializer

class OrderList(GenericListView):
    model = Order
    serializer_class = OrderSerializer

class LocatedList(GenericListView):
    model = Located
    serializer_class = LocatedSerializer
