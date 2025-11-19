from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework import generics, status, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from django.db.models import Q 
from .models import (
    Vehicle, Route, Agency, Ride, Controlled, Moved, Order, Located, Trip, Message
)
from .serializers import (
    VehicleSerializer, UserSerializerView, UserSerializer,
    RouteSerializer, AgencySerializer, RideSerializer,
    ControlledSerializer, MovedSerializer, OrderSerializer, LocatedSerializer, TripSerializer, MessageSerializer
)

User = get_user_model()

# User creation
class CreateUserView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
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

# Delete, Put and Post Generic Views
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

    def get(self, request):
        queryset = self.model.objects.filter(role='user')
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

class UserPost(GenericPostView):
    model = User
    serializer_class = UserSerializerView

class UserDelete(GenericDeleteView):
    model = User
    serializer_class = UserSerializerView

class UserUpdate(GenericUpdateView):
    model = User
    serializer_class = UserSerializerView

class UserProfile(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        user = request.user 
        serializer = UserSerializerView(user)  
        return Response(serializer.data)  
    
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

# Role-based User Views
class ClientList(GenericListView):
    model = User
    serializer_class = UserSerializerView

    def get(self, request):
        queryset = self.model.objects.filter(role='client')
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

class ClientPost(GenericPostView):
    model = User
    serializer_class = UserSerializerView

class ClientDelete(GenericDeleteView):
    model = User
    serializer_class = UserSerializerView

class ClientUpdate(GenericUpdateView):
    model = User
    serializer_class = UserSerializerView

# Staff Views
class StaffList(GenericListView):
    model = User
    serializer_class = UserSerializerView

    def get(self, request):
        queryset = self.model.objects.filter(role='staff')
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

class StaffPost(GenericPostView):
    model = User
    serializer_class = UserSerializerView

class StaffDelete(GenericDeleteView):
    model = User
    serializer_class = UserSerializerView

class StaffUpdate(GenericUpdateView):
    model = User
    serializer_class = UserSerializerView

# Driver Views
class DriverList(GenericListView):
    model = User
    serializer_class = UserSerializerView

    def get(self, request):
        queryset = self.model.objects.filter(role='driver')
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

class DriverPost(GenericPostView):
    model = User
    serializer_class = UserSerializerView

class DriverDelete(GenericDeleteView):
    model = User
    serializer_class = UserSerializerView

class DriverUpdate(GenericUpdateView):
    model = User
    serializer_class = UserSerializerView

# Agency Views
class AgencyPost(GenericPostView):
    model = Agency
    serializer_class = AgencySerializer

class AgencyDelete(GenericDeleteView):
    model = Agency

class AgencyUpdate(GenericUpdateView):
    model = Agency
    serializer_class = AgencySerializer

# Route Views
class RoutePost(GenericPostView):
    model = Route
    serializer_class = RouteSerializer

class RouteDelete(GenericDeleteView):
    model = Route

class RouteUpdate(GenericUpdateView):
    model = Route
    serializer_class = RouteSerializer

# Ride Views
class RidePost(GenericPostView):
    model = Ride
    serializer_class = RideSerializer

class RideDelete(GenericDeleteView):
    model = Ride

class RideUpdate(GenericUpdateView):
    model = Ride
    serializer_class = RideSerializer

# Controlled Views
class ControlledPost(GenericPostView):
    model = Controlled
    serializer_class = ControlledSerializer

class ControlledDelete(GenericDeleteView):
    model = Controlled

class ControlledUpdate(GenericUpdateView):
    model = Controlled
    serializer_class = ControlledSerializer

# Moved Views
class MovedPost(GenericPostView):
    model = Moved
    serializer_class = MovedSerializer

class MovedDelete(GenericDeleteView):
    model = Moved

class MovedUpdate(GenericUpdateView):
    model = Moved
    serializer_class = MovedSerializer

# Located Views
class LocatedPost(GenericPostView):
    model = Located
    serializer_class = LocatedSerializer

class LocatedDelete(GenericDeleteView):
    model = Located

class LocatedUpdate(GenericUpdateView):
    model = Located
    serializer_class = LocatedSerializer

# Trip Views
class TripPost(GenericPostView):
    model = Trip
    serializer_class = TripSerializer

class TripDelete(GenericDeleteView):
    model = Trip

class TripUpdate(GenericUpdateView):
    model = Trip
    serializer_class = TripSerializer

# Order Views
class OrderPost(GenericPostView):
    model = Order
    serializer_class = OrderSerializer

class OrderDelete(GenericDeleteView):
    model = Order

class OrderUpdate(GenericUpdateView):
    model = Order
    serializer_class = OrderSerializer

# Routes API Views
class RoutesAPIView(APIView):
    def get(self, request):
        routes = Route.objects.all()
        serializer = RouteSerializer(routes, many=True)
        return Response(serializer.data)

# Trips API Views
class TripsAPIView(APIView):
    def get(self, request):
        filters = request.GET.dict() 
        trips = Trip.objects.select_related('route', 'vehicle', 'driver').filter(**filters)
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)

class TripDetailView(APIView):
    def get(self, request, id):
        try:
            trip = Trip.objects.get(pk=id)
            serializer = TripSerializer(trip)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Trip.DoesNotExist:
            return Response({"error": "Trip not found"}, status=status.HTTP_404_NOT_FOUND)
        
# Other Model-based Views
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

class MovedFilterView(APIView):
    serializer_class = MovedSerializer
    
    def get(self, request):
        # Retrieve query parameters
        from_place = request.query_params.get('from_place', None)
        to_place = request.query_params.get('to_place', None)

        # Build the filter query using Q objects for OR logic
        filter_conditions = Q()

        if from_place:
            filter_conditions |= Q(route__from_place=from_place)
        
        if to_place:
            filter_conditions |= Q(route__to_place=to_place)

        # Apply the filter to Moved objects
        filtered_moved = Moved.objects.filter(filter_conditions)

        # Serialize the data
        serializer = MovedSerializer(filtered_moved, many=True)

        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)