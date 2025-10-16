from django.urls import path
from .views import *

urlpatterns = [
    path('reservation/', create_reservation, name='create_reservation'),
    path('reservations/', list_reservations, name='list_reservations'),
    path('reservation/<int:id>/', get_reservation, name='get_reservation'),
]