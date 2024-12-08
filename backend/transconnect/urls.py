from django.urls import path
from .views import (
    CreateUserView, DriverList, VehicleList, ClientList, StaffList, 
    RoutesAPIView, AgencyList, RideList, ControlledList, MovedList, OrderList, LocatedList,TripsAPIView
)

urlpatterns = [
    path('drivers/', DriverList.as_view(), name='drivers'),
    path('vehicles/', VehicleList.as_view(), name='vehicles'),
    path('clients/', ClientList.as_view(), name='clients'),
    path('staff/', StaffList.as_view(), name='staff'),
    path('routes/', RoutesAPIView.as_view(), name='routes'),
    path('agencies/', AgencyList.as_view(), name='agencies'),
    path('rides/', RideList.as_view(), name='rides'),
    path('controlled/', ControlledList.as_view(), name='controlled'),
    path('moved/', MovedList.as_view(), name='moved'),
    path('orders/', OrderList.as_view(), name='orders'),
    path('located/', LocatedList.as_view(), name='located'),
    path('trips/', TripsAPIView.as_view(), name='trips'),
]
