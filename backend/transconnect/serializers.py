from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from rest_framework import serializers
from .models import (
     Vehicle,  Route, Agency, Ride, Controlled, Moved, Order, Located, Trip, Message
)

User = get_user_model()
validator = UniqueValidator(queryset=User.objects.all())
print(validator)

class UserSerializer (serializers.ModelSerializer):
    class Meta:
        model=User
        fields=["id","username","password"]
        extra_kwargs={"passwords":{"write_only":True}}

    def create(self, validated_data):
        user=User.objects.create_user(**validated_data)
        return user    

class UserSerializerView(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'is_staff',
            'is_active', 'role', 'age', 'street_number', 'sector', 'district','date_joined'
        ]
        read_only_fields = ['id', 'last_login', 'date_joined']
        extra_kwargs = {
            'email': {
                'required': True,
                'validators': [UniqueValidator(queryset=User.objects.all())]
            },
            'username': {
                'required': True,
                'validators': [UniqueValidator(queryset=User.objects.all())]
            },
            'password': {'write_only': True}
        }

    def put(self, instance, validated_data):
        # Handle password separately
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)  # Hash the password
        instance.save()
        return instance
    
class VehicleSerializer(serializers.ModelSerializer):
    route = serializers.StringRelatedField()
    
    class Meta:
        model = Vehicle
        fields = '__all__'

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'

class TripSerializer(serializers.ModelSerializer):
    route = RouteSerializer()  
    driver = UserSerializerView()
    vehicle = VehicleSerializer()

    class Meta:
        model = Trip
        fields = '__all__'

class AgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = '__all__'

class RideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ride
        fields = '__all__'

class ControlledSerializer(serializers.ModelSerializer):
    class Meta:
        model = Controlled
        fields = '__all__'

class MovedSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer()
    route = RouteSerializer()

    class Meta:
        model = Moved
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class LocatedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Located
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'