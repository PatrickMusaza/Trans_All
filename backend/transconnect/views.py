from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Driver, Vehicle, Client
from .serializers import DriverSerializer, VehicleSerializer, ClientSerializer, UserSerializer

class CreateUserView(generics.CreateAPIView):
    queryset=User.objects.all()
    serializer_class=UserSerializer
    permission_classes=[AllowAny]

class DriverList(APIView):
    def get(self, request):
        drivers = Driver.objects.all()
        serializer = DriverSerializer(drivers, many=True)
        permission_classes=IsAuthenticated
        return Response(serializer.data)

class VehicleList(APIView):
    def get(self, request):
        vehicles = Vehicle.objects.all()
        serializer = VehicleSerializer(vehicles, many=True)
        permission_classes=IsAuthenticated
        return Response(serializer.data)

class ClientList(APIView):
    def get(self, request):
        clients = Client.objects.all()
        serializer = ClientSerializer(clients, many=True)
        permission_classes=IsAuthenticated
        return Response(serializer.data)
