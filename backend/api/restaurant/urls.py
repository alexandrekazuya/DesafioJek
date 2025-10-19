from django.urls import path
from .views import *

urlpatterns = [
    path('reservations/', list_or_create_reservation, name='create_reservation'),
    path('reservations/<int:id>/', delete_reservation, name='delete_reservation'),
    path('login/', login_admin, name='login_admin'),
    path('admin/dashboard/', admin_dashboard, name='admin_dashboard'),
    path('admin/summary/<str:date>/', get_daily_summary, name='daily_summary'),
    path('tables/', manage_tables, name='manage_tables'),
    path('tables/<int:id>/', delete_table, name='delete_table'),
]