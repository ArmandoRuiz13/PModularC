from django.urls import path
from . import views

urlpatterns = [
    path('', views.user_index, name = "user_index"),
    path('reportes/', views.user_reportes, name = "user_reportes"),
    path('reportar/', views.user_reportar, name = "user_reportar"),   
    path('cuenta/', views.user_cuenta, name = "user_cuenta"),
    path('academico/sending-report/', views.sendreport, name = "sendreport"),
]