from django.urls import path
from . import views

urlpatterns = [
    path('', views.Login.as_view(template_name = "login.html"), name="login"),
    path('register/', views.register, name="register"),
    path('logout/', views.logout_view, name="logout"),
]