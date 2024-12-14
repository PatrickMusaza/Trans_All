from django.urls import path
from .views import (
    DriverList, DriverPost, DriverDelete,
    VehicleList, VehiclePost, VehicleDelete,
    ClientList, ClientPost, ClientDelete,
    StaffList, StaffPost, StaffDelete,
    RoutesAPIView, RoutePost,RouteDelete,
    AgencyList, AgencyPost,AgencyDelete,
    RideList, RidePost, RideDelete,
    ControlledList, ControlledPost, ControlledDelete,
    MovedList, MovedPost, MovedDelete,
    OrderList, OrderPost, OrderDelete,
    LocatedList, LocatedPost, LocatedDelete,
    TripsAPIView, TripPost, TripDelete,
    MessageList, MessagePost, MessageDelete,
    UserList, UserPost, UserDelete
)

urlpatterns = [
    # List and Detail
    path('users/', UserList.as_view(), name='users'),
    path('users/add/', UserPost.as_view(), name='user-create'),
    path('users/<int:pk>/delete/', UserDelete.as_view(), name='user-delete'),

    path('drivers/', DriverList.as_view(), name='drivers'),
    path('drivers/add/', DriverPost.as_view(), name='driver-create'),
    path('drivers/<int:pk>/delete/', DriverDelete.as_view(), name='driver-delete'),

    path('vehicles/', VehicleList.as_view(), name='vehicles'),
    path('vehicles/add/', VehiclePost.as_view(), name='vehicle-create'),
    path('vehicles/<int:pk>/delete/', VehicleDelete.as_view(), name='vehicle-delete'),

    path('clients/', ClientList.as_view(), name='clients'),
    path('clients/add/', ClientPost.as_view(), name='client-create'),
    path('clients/<int:pk>/delete/', ClientDelete.as_view(), name='client-delete'),

    path('staff/', StaffList.as_view(), name='staff'),
    path('staff/add/', StaffPost.as_view(), name='staff-create'),
    path('staff/<int:pk>/delete/', StaffDelete.as_view(), name='staff-delete'),

    path('routes/', RoutesAPIView.as_view(), name='routes'),
    path('routes/add/', RoutePost.as_view(), name='route-create'),
    path('routes/<int:pk>/delete/', RouteDelete.as_view(), name='route-delete'),


    path('agencies/', AgencyList.as_view(), name='agencies'),
    path('agencies/add/', AgencyPost.as_view(), name='agency-create'),
    path('agencies/<int:pk>/delete/', AgencyDelete.as_view(), name='agency-delete'),

    path('rides/', RideList.as_view(), name='rides'),
    path('rides/add/', RidePost.as_view(), name='ride-create'),
    path('rides/<int:pk>/delete/', RideDelete.as_view(), name='ride-delete'),

    path('controlled/', ControlledList.as_view(), name='controlled'),
    path('controlled/add/', ControlledPost.as_view(), name='controlled-create'),
    path('controlled/<int:pk>/delete/', ControlledDelete.as_view(), name='controlled-delete'),

    path('moved/', MovedList.as_view(), name='moved'),
    path('moved/add/', MovedPost.as_view(), name='moved-create'),
    path('moved/<int:pk>/delete/', MovedDelete.as_view(), name='moved-delete'),

    path('orders/', OrderList.as_view(), name='orders'),
    path('orders/add/', OrderPost.as_view(), name='order-create'),
    path('orders/<int:pk>/delete/', OrderDelete.as_view(), name='order-delete'),

    path('located/', LocatedList.as_view(), name='located'),
    path('located/add/', LocatedPost.as_view(), name='located-create'),
    path('located/<int:pk>/delete/', LocatedDelete.as_view(), name='located-delete'),

    path('trips/', TripsAPIView.as_view(), name='trips'),
    path('trips/add/', TripPost.as_view(), name='trip-create'),
    path('trips/<int:pk>/delete/', TripDelete.as_view(), name='trip-delete'),

    path('messages/', MessageList.as_view(), name='messages'),
    path('messages/add/', MessagePost.as_view(), name='message-create'),
    path('messages/<int:pk>/delete/', MessageDelete.as_view(), name='message-delete'),
]
