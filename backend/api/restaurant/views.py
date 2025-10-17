from rest_framework.decorators import api_view, permission_classes, authentication_classes
from .serializers import *
from rest_framework.response import Response
from .models import *
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import TokenAuthentication

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
@api_view(['GET', 'POST'])
def list_or_create_reservation(request):

    if request.method == 'GET':
        reservations = Reservation.objects.all()
        serealizer = getAllReservationsSerializer(reservations, many=True)
        return Response(serealizer.data) 


    if request.method == 'POST':
        tables = getTable(request.data['restaurant'], request.data['guestsNr'])
        if tables == None:
            return Response({"message": "no tables gang"}, status=400)
        
        for table in tables: #checkar se a mesa ja ta ocupada
            if(Reservation.objects.filter(table=table, date=request.data['date']).exists()):
                return Response({"message": "table already booked at this time"}, status=400)
            
        request.data['table'] = []
        for table in tables:
            request.data['table'].append(table.id)
        
        serealizer = createReservationSerializer(data=request.data)
        if not serealizer.is_valid():
            return Response(serealizer.errors, status=400)
        serealizer.save()
        
        return Response({"message": "reservado successfully"}, status=201)

#--so admin --
@api_view(['GET', 'DELETE'])
def get_or_delete_reservation(request, id):

    if request.method == 'GET':
        reservation = get_object_or_404(Reservation, id=id)
        serializer = getReservationSerializer(reservation)
        return Response(serializer.data)
    

    if request.method == 'DELETE':
        reservation = get_object_or_404(Reservation, id=id)
        reservation_tables = reservation.table.all()
        for table in reservation_tables:
            table.occupied = False
            table.save()
        reservation.delete()
        return Response({"message": "deleted successfully"})


 #--login-   
@api_view(['POST'])
def login_admin(request):
    username = request.data['name']
    password = request.data['password']
    
    user = authenticate(username=username, password=password)
    if user is None or not user.is_staff:
        return Response({"detail": "invalido"}, status=401)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key, "username": user.username})

@api_view(['GET']) #qnd dá login successfully, vê esta shi
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_dashboard(request):
    return Response({"message": f"welcome, {request.user.username}"})
