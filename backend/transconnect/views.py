from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Driver, Vehicle, Client
from .serializers import DriverSerializer, VehicleSerializer, ClientSerializer

class DriverList(APIView):
    def get(self, request):
        drivers = Driver.objects.all()
        serializer = DriverSerializer(drivers, many=True)
        return Response(serializer.data)

class VehicleList(APIView):
    def get(self, request):
        vehicles = Vehicle.objects.all()
        serializer = VehicleSerializer(vehicles, many=True)
        return Response(serializer.data)

class ClientList(APIView):
    def get(self, request):
        clients = Client.objects.all()
        serializer = ClientSerializer(clients, many=True)
        return Response(serializer.data)
