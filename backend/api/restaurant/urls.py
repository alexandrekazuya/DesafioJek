from django.urls import path
from .views import *

urlpatterns = [
    path('reservations/', list_or_create_reservation, name='create_reservation'),
    path('reservations/<int:id>/', get_or_delete_reservation, name='get_reservation'),
    path('login/', login_admin, name='login_admin'),
    path('admin/dashboard/', admin_dashboard, name='admin_dashboard'),
]