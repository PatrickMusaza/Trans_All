from django.urls import path
from .views import (
    DriverList, VehicleList, ClientList, StaffList, 
    RoutesAPIView, AgencyList, RideList, ControlledList, MovedList, OrderList, LocatedList, TripsAPIView, MessageSerializer
)

urlpatterns = [
    path('drivers/', DriverList.as_view(), name='drivers'),
    path('drivers/<int:id>/', DriverList.as_view(), name='driver-detail'),
    path('vehicles/', VehicleList.as_view(), name='vehicles'),
    path('vehicles/<int:id>/', VehicleList.as_view(), name='vehicle-detail'),
    path('clients/', ClientList.as_view(), name='clients'),
    path('clients/<int:id>/', ClientList.as_view(), name='client-detail'),
    path('staff/', StaffList.as_view(), name='staff'),
    path('staff/<int:id>/', StaffList.as_view(), name='staff-detail'),
    path('routes/', RoutesAPIView.as_view(), name='routes'),
    path('agencies/', AgencyList.as_view(), name='agencies'),
    path('agencies/<int:id>/', AgencyList.as_view(), name='agency-detail'),
    path('rides/', RideList.as_view(), name='rides'),
    path('rides/<int:id>/', RideList.as_view(), name='ride-detail'),
    path('controlled/', ControlledList.as_view(), name='controlled'),
    path('controlled/<int:id>/', ControlledList.as_view(), name='controlled-detail'),
    path('moved/', MovedList.as_view(), name='moved'),
    path('moved/<int:id>/', MovedList.as_view(), name='moved-detail'),
    path('orders/', OrderList.as_view(), name='orders'),
    path('orders/<int:id>/', OrderList.as_view(), name='order-detail'),
    path('located/', LocatedList.as_view(), name='located'),
    path('located/<int:id>/', LocatedList.as_view(), name='located-detail'),
    path('trips/', TripsAPIView.as_view(), name='trips'),
    path('trips/<int:id>/', TripsAPIView.as_view(), name='trip-detail'),
    path('messages/', TripsAPIView.as_view(), name='messages'),
    path('messages/<int:id>/', TripsAPIView.as_view(), name='message-detail'),
]
