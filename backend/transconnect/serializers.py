from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Driver, Vehicle, Client

class UserSerializer (serializers.ModelSerializer):
    class Meta:
        model=User
        fields=["id","username","password"]
        extra_kwargs={"passwords":{"write_only":True}}

    def create(self, validated_data):
        user=User.objects.create_user(**validated_data)
        return user    

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
