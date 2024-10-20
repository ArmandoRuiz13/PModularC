from django.urls import path
from . import views


urlpatterns = [
    path('', views.admlogin, name="inicio"),
    path('reportes', views.admReportes, name="reportes"),
    path('info/', views.admInfo, name="info"),
    path('edificios/', views.admEdificios, name="edificios"),
    path('usuarios/', views.admUsuarios, name="usuarios_admin"),
    path('reportes/', views.admReportes, name="reportes"),
    path('terminados/', views.admTerminados, name="terminados"),
    path('edificios/<str:letra>/', views.admGetEdificio, name="get_edificio"),
    path('notificaciones/', views.admNotificaciones, name="notificaciones"),
    path('cuenta/', views.admCuenta, name="cuentaAdmin"),
    path('reporte/<int:id>/', views.admReporte, name="reporte"),
    path('IA/', views.asistenteDatosIA, name="datosIA"),
]
