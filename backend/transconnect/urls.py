from django.urls import path
from .views import DriverList, VehicleList, ClientList

urlpatterns = [
    path('drivers/', DriverList.as_view(), name='drivers'),
    path('vehicles/', VehicleList.as_view(), name='vehicles'),
    path('clients/', ClientList.as_view(), name='clients'),
]
