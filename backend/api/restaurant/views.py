from rest_framework.decorators import api_view, permission_classes, authentication_classes
from .serializers import *
from rest_framework.response import Response
from .models import *
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from django.utils.dateparse import parse_date

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

@api_view(['GET', 'POST'])
def list_or_create_reservation(request):

    if request.method == 'GET':
        reservations = Reservation.objects.all()
        serealizer = getReservationSerializer(reservations, many=True)
        return Response(serealizer.data) 

    if request.method == 'POST':
        guestsNr = int(request.data.get('guestsNr'))
        tables = getTable(request.data['restaurant'], guestsNr)
        if tables == None:
            return Response({"message": "no tables gang"}, status=400)
        
        for table in tables: #checkar se a mesa ja ta ocupada
            if(Reservation.objects.filter(table=table, date=request.data['date']).exists()):
                return Response({"message": "table ta ocupada"}, status=400)
            
        request.data['table'] = []
        for table in tables:
            request.data['table'].append(table.id)
        
        serealizer = createReservationSerializer(data=request.data)
        if not serealizer.is_valid():
            return Response(serealizer.errors, status=400)
        serealizer.save()
        
        return Response({"message": "reservado successfully"}, status=201)

#--so admin --
@api_view(['DELETE'])
def delete_reservation(request, id):
    if request.method == 'DELETE':
        reservation = get_object_or_404(Reservation, id=id)
        reservation_tables = reservation.table.all()
        for table in reservation_tables:
            table.occupied = False
            table.save()
        reservation.delete()
        return Response({"message": "deleted successfully"})

@api_view(['GET'])
def get_daily_summary(request, date):
    parsed_date = parse_date(date)
    if not parsed_date:
        return Response({"message": "Invalid date format. Use YYYY-MM-DD."}, status=400)

    reservations = Reservation.objects.filter(date__date=parsed_date)

    total_guests = sum(r.guestsNr for r in reservations)
    total_reservations = reservations.count()

    occupied_ids = set(reservations.values_list('table__id', flat=True))
    all_ids = set(Table.objects.values_list('id', flat=True))
    unoccupied_ids = sorted(all_ids - occupied_ids)

    summary = {
        "date": date,
        "total_guests": total_guests,
        "total_reservations": total_reservations,
        "occupied_tables": sorted(occupied_ids),
        "unoccupied_tables": unoccupied_ids,
    }
    return Response(summary)


@api_view(['GET', 'POST'])
def manage_tables(request):
    if request.method == 'GET':
        tables = Table.objects.all().values('id', 'occupied', 'maxSeats', 'restaurant')
        return Response(list(tables))

    else:
        table = Table.objects.create(
            occupied=False,
            maxSeats=10,
            restaurant_id=1
        )

        return Response({
            'id': table.id,
            'occupied': table.occupied,
            'maxSeats': table.maxSeats,
            'restaurant': table.restaurant.id
        }, status=201)

@api_view(['DELETE'])
def delete_table(request, id):
    reservation = Reservation.objects.filter(table__id=id)
    if reservation.exists():
        reservation.delete()
    table = get_object_or_404(Table, id=id)
    table.delete()
    return Response({'message': f'Table {id} deleted successfully.'}, status=200)

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
