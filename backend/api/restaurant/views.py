from rest_framework.decorators import api_view
from .serializers import *
from rest_framework.response import Response
from .models import *
from django.shortcuts import get_object_or_404

def getTable(restaurant,guestsNr):
    returnTables = []
    tables = Table.objects.filter(restaurant=restaurant, occupied=False).order_by('-maxSeats')
    seats_needed = guestsNr
    for table in tables:
        if seats_needed <= 0:
            break
        returnTables.append(table)
        seats_needed -= table.maxSeats
    if seats_needed > 0:
        return None
    for table in returnTables:
        table.occupied = True
        table.save()
    return returnTables

# Create your views here.
@api_view(['POST'])
def create_reservation(request):
    tables = getTable(request.data['restaurant'], request.data['guestsNr'])
    if tables == None:
        return Response({"message": "no tables gang"}, status=400)
    request.data['table'] = []
    for table in tables:
        request.data['table'].append(table.id)
    
    serealizer = createReservationSerializer(data=request.data)
    if not serealizer.is_valid():
        return Response(serealizer.errors, status=400)
    serealizer.save()
    
    return Response({"message": "reservado successfully"}, status=201)

@api_view(['GET'])
def list_reservations(request):
    reservations = Reservation.objects.all()
    serealizer = getAllReservationsSerializer(reservations, many=True)
    return Response(serealizer.data)    

@api_view(['GET'])
def get_reservation(request, id):
    reservation = get_object_or_404(Reservation, id=id)
    serializer = getReservationSerializer(reservation)
    return Response(serializer.data)

#--admin--