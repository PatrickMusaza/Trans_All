from django.urls import path
from .views import (
    DriverList, DriverPost, DriverDelete,DriverUpdate,
    VehicleList, VehiclePost, VehicleDelete,VehicleUpdate,
    ClientList, ClientPost, ClientDelete,ClientUpdate,
    StaffList, StaffPost, StaffDelete,StaffUpdate,
    RoutesAPIView, RoutePost,RouteDelete,RouteUpdate,
    AgencyList, AgencyPost,AgencyDelete,AgencyUpdate,
    RideList, RidePost, RideDelete,RideUpdate,
    ControlledList, ControlledPost, ControlledDelete,ControlledUpdate,
    MovedList, MovedPost, MovedDelete,MovedUpdate,MovedFilterView,
    OrderList, OrderPost, OrderDelete,OrderUpdate,
    LocatedList, LocatedPost, LocatedDelete,LocatedUpdate,
    TripsAPIView, TripPost, TripDelete,TripUpdate,TripDetailView,
    MessageList, MessagePost, MessageDelete,MessageUpdate,
    UserList, UserPost, UserDelete,UserUpdate,UserProfile
)

urlpatterns = [
    # List and Detail   
    path('users/', UserList.as_view(), name='users'),
    path('users/profile/', UserProfile.as_view(), name='user-profile'),
    path('users/add/', UserPost.as_view(), name='user-create'),
    path('users/<int:id>/delete/', UserDelete.as_view(), name='user-delete'),
    path('users/<int:id>/update/', UserUpdate.as_view(), name='user-edit'),  

    path('drivers/', DriverList.as_view(), name='drivers'),
    path('drivers/add/', DriverPost.as_view(), name='driver-create'),
    path('drivers/<int:id>/delete/', DriverDelete.as_view(), name='driver-delete'),
    path('drivers/<int:id>/update/', DriverUpdate.as_view(), name='driver-edit'),  

    path('vehicles/', VehicleList.as_view(), name='vehicles'),
    path('vehicles/add/', VehiclePost.as_view(), name='vehicle-create'),
    path('vehicles/<int:id>/delete/', VehicleDelete.as_view(), name='vehicle-delete'),
    path('vehicles/<int:id>/update/', VehicleUpdate.as_view(), name='vehicle-edit'),  

    path('clients/', ClientList.as_view(), name='clients'),
    path('clients/add/', ClientPost.as_view(), name='client-create'),
    path('clients/<int:id>/delete/', ClientDelete.as_view(), name='client-delete'),
    path('clients/<int:id>/update/', ClientUpdate.as_view(), name='client-edit'),  

    path('staff/', StaffList.as_view(), name='staff'),
    path('staff/add/', StaffPost.as_view(), name='staff-create'),
    path('staff/<int:id>/delete/', StaffDelete.as_view(), name='staff-delete'),
    path('staff/<int:id>/update/', StaffUpdate.as_view(), name='staff-edit'),  

    path('routes/', RoutesAPIView.as_view(), name='routes'),
    path('routes/add/', RoutePost.as_view(), name='route-create'),
    path('routes/<int:id>/delete/', RouteDelete.as_view(), name='route-delete'),
    path('routes/<int:id>/update/', RouteUpdate.as_view(), name='route-edit'),  

    path('agencies/', AgencyList.as_view(), name='agencies'),
    path('agencies/add/', AgencyPost.as_view(), name='agency-create'),
    path('agencies/<int:id>/delete/', AgencyDelete.as_view(), name='agency-delete'),
    path('agencies/<int:id>/update/', AgencyUpdate.as_view(), name='agency-edit'),  

    path('rides/', RideList.as_view(), name='rides'),
    path('rides/add/', RidePost.as_view(), name='ride-create'),
    path('rides/<int:id>/delete/', RideDelete.as_view(), name='ride-delete'),
    path('rides/<int:id>/update/', RideUpdate.as_view(), name='ride-edit'),  

    path('controlled/', ControlledList.as_view(), name='controlled'),
    path('controlled/add/', ControlledPost.as_view(), name='controlled-create'),
    path('controlled/<int:id>/delete/', ControlledDelete.as_view(), name='controlled-delete'),
    path('controlled/<int:id>/update/', ControlledUpdate.as_view(), name='controlled-edit'),  

    path('moved/', MovedList.as_view(), name='moved'),    
    path('moves/', MovedFilterView.as_view(), name='moved-filtered'),
    path('moved/add/', MovedPost.as_view(), name='moved-create'),
    path('moved/<int:id>/delete/', MovedDelete.as_view(), name='moved-delete'),
    path('moved/<int:id>/update/', MovedUpdate.as_view(), name='moved-edit'),  

    path('orders/', OrderList.as_view(), name='orders'),
    path('orders/add/', OrderPost.as_view(), name='order-create'),
    path('orders/<int:id>/delete/', OrderDelete.as_view(), name='order-delete'),
    path('orders/<int:id>/update/', OrderUpdate.as_view(), name='order-edit'),  

    path('located/', LocatedList.as_view(), name='located'),
    path('located/add/', LocatedPost.as_view(), name='located-create'),
    path('located/<int:id>/delete/', LocatedDelete.as_view(), name='located-delete'),
    path('located/<int:id>/update/', LocatedUpdate.as_view(), name='located-edit'),  

    path('trips/', TripsAPIView.as_view(), name='trips'),
    path('trips/<int:id>/', TripDetailView.as_view(), name='trip-detail'),
    path('trips/add/', TripPost.as_view(), name='trip-create'),
    path('trips/<int:id>/delete/', TripDelete.as_view(), name='trip-delete'),
    path('trips/<int:id>/update/', TripUpdate.as_view(), name='trip-edit'),  

    path('messages/', MessageList.as_view(), name='messages'),
    path('messages/add/', MessagePost.as_view(), name='message-create'),
    path('messages/<int:id>/delete/', MessageDelete.as_view(), name='message-delete'),
    path('messages/<int:id>/update/', MessageUpdate.as_view(), name='message-edit'),  
]