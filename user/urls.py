from django.urls import path
from . import views

urlpatterns = [
    path('', views.user_index, name = "user_index"),
    path('reportes/', views.user_reportes, name = "user_reportes"),
    path('reportar/', views.user_reportar, name = "user_reportar"),   
    path('cuenta/', views.user_cuenta, name = "user_cuenta"),
    path('cuenta/cambiar-contraseña/', views.change_password, name='change_password'),
    path('notificaciones',views.user_notificaciones, name='notificaciones'),
    path('crear-reportes/', views.crear_reportes, name='crear_reportes'),
    path('exportar-reportes/', views.export_reportes_csv, name='export_reportes_csv'),
    ]