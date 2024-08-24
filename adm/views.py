from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden
from user.models import Problema
from login.models import CustomUser as User
from django.db.models import Count, Q, F
from user.models import Notification


# Create your views here.


@login_required(login_url='/')
def admlogin(request):
    if not request.user.is_staff:
        return HttpResponseForbidden("Access denied")
    return render(request, 'inicioAdministrador.html', {})

@login_required(login_url='/')
def admReportes(request):
    if not request.user.is_staff:
        return HttpResponseForbidden("Access denied")
    current_problemas = Problema.objects.filter(estatus_problematica='Procesando').order_by('id').iterator()
    current_problemas = list(current_problemas)[:10]
    return render(request, 'adm_reportes.html', {'problemas':current_problemas}) 

@login_required(login_url='/')
def admInfo(request):
    if not request.user.is_staff:
        return HttpResponseForbidden("Access denied")
    return render(request, 'adm_informacion.html', {})

@login_required(login_url='/')
def admEdificios(request):
    if not request.user.is_staff:
        return HttpResponseForbidden("Access denied")
    return render(request, 'adm_edificios.html', {})

@login_required(login_url='/')
def admSeguimiento(request):
    if not request.user.is_staff:
        return HttpResponseForbidden("Access denied")
    return render(request, 'adm_seguimiento.html', {})

@login_required(login_url='/')
def admNotificaciones(request):
    current_user = request.user
    current_notificacion = Notification.objects.filter(user =current_user)
    return render(request, 'adm_notificaciones.html',{'notificaciones':current_notificacion})
    
def admTerminados(request):
    return render(request, 'adm_terminados.html', {})

@login_required(login_url='/')
def admGetEdificio(request, letra):
    if not request.user.is_staff:
        return HttpResponseForbidden("Access denied")
    return render(request, 'adm_edificios_info.html', {"letra": letra})


@login_required(login_url='/')
def admCuenta(request):
    if not request.user.is_staff:
        return HttpResponseForbidden("Access denied")
    current_user = request.user
    return render(request, 'adm_cuenta.html', {'user':current_user})


@login_required(login_url='/')
def admReporte(request, id):
    if not request.user.is_staff:
        return HttpResponseForbidden("Access denied")
    current_problema = Problema.objects.get(id=id)
    return render(request, 'adm_reporte.html', {'problema':current_problema})

@login_required(login_url='/')
def asistenteDatosIA(request):
    if not request.user.is_staff:
        return HttpResponseForbidden("Access denied")
    return render(request, 'adm_datosIA.html', {})

@login_required(login_url='/')
def admUsuarios(request):
    if not request.user.is_staff:
        return HttpResponseForbidden("Access denied")
    current_usuarios = queryset = User.objects.annotate(
            num_reportes=Count('problema', filter=Q(problema__id_usuario=F('id')))
        ).order_by('id')
    current_usuarios = list(current_usuarios)[:10]
    return render(request, 'adm_usuarios.html', {'usuarios':current_usuarios})