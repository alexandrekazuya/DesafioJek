from rest_framework import serializers
from .models import Restaurant, Table, Reservation

class createReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['name', 'phoneNr', 'date', 'guestsNr', 'notes', 'table', 'restaurant']

class getReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__' #em vez de meter todos um a um

class getAllReservationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['name', 'table', 'date']