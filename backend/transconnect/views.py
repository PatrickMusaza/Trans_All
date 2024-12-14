from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import (
    Driver, Vehicle, Client, Staff, Route, Agency, Ride, Controlled, Moved, Order, Located, Trip, Message
)
from .serializers import (
    DriverSerializer, VehicleSerializer, ClientSerializer, UserSerializerView, UserSerializer,
    StaffSerializer, RouteSerializer, AgencySerializer, RideSerializer, 
    ControlledSerializer, MovedSerializer, OrderSerializer, LocatedSerializer, TripSerializer, MessageSerializer
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

# Delete,Put and Post Generic Views
class GenericDeleteView(APIView):
    model = None
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        obj = get_object_or_404(self.model, id=id)
        obj.delete()
        return Response({"message": f"{self.model.__name__} with ID {id} deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class GenericPostView(APIView):
    model = None
    serializer_class = None
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GenericUpdateView(APIView):
    model = None
    serializer_class = None
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        obj = get_object_or_404(self.model, id=id)
        serializer = self.serializer_class(obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# Specific Views
class UserList(GenericListView):
    model = User
    serializer_class = UserSerializerView

class UserPost(GenericPostView):
    model = User
    serializer_class = UserSerializerView

class UserDelete(GenericDeleteView):
    model = User
    serializer_class = UserSerializerView

class UserUpdate(GenericUpdateView):
    model = User
    serializer_class = UserSerializerView

class DriverList(GenericListView):
    model = Driver
    serializer_class = DriverSerializer

class DriverPost(GenericPostView):
    model = Driver
    serializer_class = DriverSerializer

class DriverDelete(GenericDeleteView):
    model = Driver

class DriverUpdate(GenericUpdateView):
    model = Driver
    serializer_class = DriverSerializer

class VehicleList(GenericListView):
    model = Vehicle
    serializer_class = VehicleSerializer

class VehiclePost(GenericPostView):
    model = Vehicle
    serializer_class = VehicleSerializer

class VehicleDelete(GenericDeleteView):
    model = Vehicle

class VehicleUpdate(GenericUpdateView):
    model = Vehicle
    serializer_class = VehicleSerializer

class ClientList(GenericListView):
    model = Client
    serializer_class = ClientSerializer

class ClientPost(GenericPostView):
    model = Client
    serializer_class = ClientSerializer

class ClientDelete(GenericDeleteView):
    model = Client

class ClientUpdate(GenericUpdateView):
    model = Client
    serializer_class = ClientSerializer

class StaffList(GenericListView):
    model = Staff
    serializer_class = StaffSerializer

class StaffPost(GenericPostView):
    model = Staff
    serializer_class = StaffSerializer

class StaffDelete(GenericDeleteView):
    model = Staff

class UserUpdate(GenericUpdateView):
    model = User
    serializer_class = UserSerializer

class AgencyPost(GenericPostView):
    model = Agency
    serializer_class = AgencySerializer

class AgencyDelete(GenericDeleteView):
    model = Agency
    
class UserUpdate(GenericUpdateView):
    model = User
    serializer_class = UserSerializer

class RoutePost(GenericPostView):
    model = Route
    serializer_class = RouteSerializer

class RouteDelete(GenericDeleteView):
    model = Route

class UserUpdate(GenericUpdateView):
    model = User
    serializer_class = UserSerializer

class RidePost(GenericPostView):
    model = Ride
    serializer_class = RideSerializer

class RideDelete(GenericDeleteView):
    model = Ride
    
class UserUpdate(GenericUpdateView):
    model = User
    serializer_class = UserSerializer

class ControlledPost(GenericPostView):
    model = Controlled
    serializer_class = ControlledSerializer

class ControlledDelete(GenericDeleteView):
    model = Controlled
    
class UserUpdate(GenericUpdateView):
    model = User
    serializer_class = UserSerializer

class MovedPost(GenericPostView):
    model = Moved
    serializer_class = MovedSerializer

class MovedDelete(GenericDeleteView):
    model = Moved
    
class UserUpdate(GenericUpdateView):
    model = User
    serializer_class = UserSerializer

class LocatedPost(GenericPostView):
    model = Located
    serializer_class = LocatedSerializer

class LocatedDelete(GenericDeleteView):
    model = Located
    
class UserUpdate(GenericUpdateView):
    model = User
    serializer_class = UserSerializer

class TripPost(GenericPostView):
    model = Trip
    serializer_class = TripSerializer

class TripDelete(GenericDeleteView):
    model = Trip
    
class UserUpdate(GenericUpdateView):
    model = User
    serializer_class = UserSerializer

class OrderPost(GenericPostView):
    model = Order
    serializer_class = OrderSerializer

class OrderDelete(GenericDeleteView):
    model = Order

class UserUpdate(GenericUpdateView):
    model = User
    serializer_class = UserSerializer

class RoutesAPIView(APIView):
    def get(self, request):
        routes = Route.objects.all()
        serializer = RouteSerializer(routes, many=True)
        return Response(serializer.data)

class TripsAPIView(APIView):
    def get(self, request):
        filters = request.GET.dict()
        trips = Trip.objects.filter(**filters)
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)

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

class MessagePost(generics.CreateAPIView):
    model = Message
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

class MessageList(GenericListView):
    model = Message
    serializer_class = MessageSerializer

class MessageDelete(GenericDeleteView):
    model = Message
    serializer_class = MessageSerializer

class MessageUpdate(GenericUpdateView):
    model = Message
    serializer_class = MessageSerializer