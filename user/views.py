from django.shortcuts import render,get_object_or_404
from django.forms.models import model_to_dict
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse,JsonResponse
from api_registros.forms import formAcademicos, formBaños, formAreasComunes, formDepartamento
from .models import Problema, ProblemaEnCurso, Notification
from login.models import CustomUser
from django.core.exceptions import ObjectDoesNotExist
import json
from .populate import crear_reportes_falsos
from django.core.paginator import Paginator

import csv

# Create your views here.
    
@login_required(login_url='/')
def user_index(request):
    current_user = request.user
    return render(request, 'user_index.html', {'user':current_user})

@login_required(login_url='/')
def user_reportes(request):
    current_user = request.user
    current_problemas=Problema.objects.filter(id_usuario=current_user)
    return render(request, 'user_reportes.html', {'user':current_user,'problemas':current_problemas}) 


@login_required(login_url='/')
def user_reportar(request):
    return render(request, 'user_reportar.html', {})

@login_required(login_url='/')
def user_cuenta(request):
    current_user = request.user
    return render(request, 'user_cuenta.html', {'user':current_user})


@login_required(login_url='/')
def user_notificaciones(request):
    current_user = request.user
    current_notificacion = Notification.objects.filter(user =current_user)
    return render(request, 'user_notificaciones.html', {'notificaciones':current_notificacion})
     
# Cambiar contraseña
@login_required(login_url='/')
def change_password(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        user = request.user
        if user.check_password(data['old_password']):
            user.set_password(data['new_password'])
            user.save()
            return JsonResponse({'message': 'Contraseña cambiada exitosamente'}, status=200)
        else:
            return JsonResponse({'error': 'Contraseña actual incorrecta'}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@login_required(login_url='/')
def crear_reportes(request):
    crear_reportes_falsos(100)
    return JsonResponse({'message': 'Reportes creados exitosamente'}, status=200)

@login_required(login_url='/')
def export_reportes_csv(request):
    # Crear una respuesta con el tipo de contenido adecuado para archivos CSV
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename=reportes.csv'
    
    # Crear el objeto CSV writer
    writer = csv.writer(response)
    
    # Escribir la cabecera del CSV
    writer.writerow(['id', 'usuario', 'tipo_edificio', 'tipo_problema', 'gravedad_problema', 'fecha', 'letra_edificio', 'numero_salon', 'tipo_bano', 'edificio_bano', 'piso_bano', 'tipo_area', 'tipo_departamento', 'tipo_edificio_departamento'])
    
    # Consultar todos los reportes
    reportes = Problema.objects.all()
    
    # Paginar los reportes en lotes de 100
    paginator = Paginator(reportes, 100)  # Dividir en lotes de 100 reportes

    # Recorrer las páginas y escribir los reportes en el CSV
    for page_number in paginator.page_range:
        page = paginator.page(page_number)
        for reporte in page.object_list:
            writer.writerow([
                reporte.id,
                reporte.id_usuario.username if reporte.id_usuario else 'N/A',
                reporte.tipo_edificio,
                reporte.tipo_problema,
                reporte.gravedad_problema,
                reporte.fecha_creacion if hasattr(reporte, 'fecha_creacion') else 'N/A',
                reporte.letra_edificio if hasattr(reporte, 'letra_edificio') else 'N/A',
                reporte.numero_salon if hasattr(reporte, 'numero_salon') else 'N/A',
                reporte.tipo_baño if hasattr(reporte, 'tipo_baño') else 'N/A',
                reporte.edificio_baño if hasattr(reporte, 'edificio_baño') else 'N/A',
                reporte.piso_baño if hasattr(reporte, 'piso_baño') else 'N/A',
                reporte.tipo_area if hasattr(reporte, 'tipo_area') else 'N/A',
                reporte.tipo_departamento if hasattr(reporte, 'tipo_departamento') else 'N/A',
                reporte.tipo_edificio_departamento if hasattr(reporte, 'tipo_edificio_departamento') else 'N/A',
            ])
    
    return response

