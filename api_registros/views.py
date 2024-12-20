from django.http import JsonResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from user.models import Problema, ProblemaEnCurso, Notification
import pytz
from rest_framework.permissions import IsAuthenticated
from api_registros.forms import formAcademicos, formBaños, formAreasComunes, formDepartamento
from login.models import CustomUser
import json
from django.core.exceptions import ObjectDoesNotExist
from .serializers import ProblemaSerializer, ProblemaEnCursoSerializer, NotificacionSerializer, UsuarioSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from login.forms import LoginForm, RegisterForm
from django.contrib.auth import authenticate, login, logout
from datetime import datetime, timedelta
from django.db.models import Count, Q, F

import cloudinary.uploader
from rest_framework.response import Response
from rest_framework import status

# Zona horaria de México
timezone = pytz.timezone('America/Mexico_City')

class NotificacionesAPIView(APIView):
    """
    Vista para manejar operaciones de listado y recuperación de notificaciones basadas en el tipo de solicitud.
    """
    permission_classes = [IsAuthenticated]  # Asegura que solo los usuarios autenticados puedan acceder

    @swagger_auto_schema(
        operation_summary="Crear notificación",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['type', 'title', 'message', 'user'],  # Especificar los campos requeridos aquí
            properties={
                'type': openapi.Schema(type=openapi.TYPE_STRING, description='Tipo de notificación'),
                'title': openapi.Schema(type=openapi.TYPE_STRING, description='Título de la notificación'),
                'message': openapi.Schema(type=openapi.TYPE_STRING, description='Mensaje de la notificación'),
                'user': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID del usuario'),
            },
        ),
        responses={
            201: NotificacionSerializer,
            400: "Datos inválidos"
        }
    )

    def post(self, request, *args, **kwargs):
        type = request.data.get('type')
        title = request.data.get('title')
        message = request.data.get('message')
        print(message)
        user = CustomUser.objects.get(id=request.data.get('user'))
        admin_u = request.user.first_name + " " +  request.user.last_name

        if(type == "Promoción"):
            message = f"""
                Hola {user.first_name.split(" ")[0] + " " +  user.last_name.split(" ")[0]}:

                Quería informarte que has sido promovido a la posición de administrador por {admin_u}.
                ¡Felicidades por el ascenso! Estamos seguros de que harás un excelente trabajo en tu nuevo rol.
                Si tienes alguna preguna o necesitas ayuda con la transición, no dudes en contactarnos.
                ¡Enhorabuena y mucho éxito en esta nueva etapa!

                {"Razón: " + message if message is not None and message != "" else ""}

                Saludos,
                {admin_u}
            """
        elif(type == "Degradación"):
            message = f"""
                Hola {user.first_name.split(" ")[0] + " " + user.last_name.split(" ")[0]}:

                Queremos informarte que has sido degradado de la posición de administrador por {admin_u}.
                Si tienes alguna duda o deseas obtener más información sobre esta decisión, por favor contáctanos.

                {"Razón: " + message if message is not None and message != "" else ""}

                Lamentamos cualquier inconveniente.

                Saludos,
                {admin_u}
            """
        elif(type == "Notificacion"):
            message = f"""
                Hola {user.first_name.split(" ")[0]}:

                Se te envió una notificación con el siguiente mensaje:

                "{message if message is not None and message != "" else "No se proporcionó un mensaje adicional."}"

                Saludos,
                {admin_u}
            """
        elif(type == "Alerta"):
            message = f"""
                Hola {user.first_name.split(" ")[0]}:

                Se te envió una alerta con el siguiente mensaje:

                "{message if message is not None and message != "" else "No se proporcionó un mensaje adicional."}"

                Saludos,
                {admin_u}
            """
        elif(type == "Advertencia"):
            message = f"""
                Hola {user.first_name.split(" ")[0]}:

                Se te envió una advertencia con el siguiente mensaje:

                "{message if message is not None and message != "" else "No se proporcionó un mensaje adicional."}"

                Saludos,
                {admin_u}
            """
        elif(type == "Anuncio"):
            message = f"""
                Hola {user.first_name.split(" ")[0]}:

                Se te envió un anuncio con el siguiente mensaje:

                "{message if message is not None and message != "" else "No se proporcionó un mensaje adicional."}"

                Saludos,
                {admin_u}
            """
        elif(type == "Confirmacion"):
            message = f"""
                Hola {user.first_name.split(" ")[0]}:

                Se te envió una confirmación con el siguiente mensaje:

                "{message if message is not None and message != "" else "No se proporcionó un mensaje adicional."}"

                Saludos,
                {admin_u}
            """
        elif(type == "Solicitud"):
            message = f"""
                Hola {user.first_name.split(" ")[0]}:

                Se te envió una solicitud de información con el siguiente mensaje:

                "{message if message is not None and message != "" else "No se proporcionó un mensaje adicional."}"

                Saludos,
                {admin_u}
            """
        elif(type == "Instruccion"):
            message = f"""
                Hola {user.first_name.split(" ")[0]}:

                Se te envió una instrucción con el siguiente mensaje:

                "{message if message is not None and message != "" else "No se proporcionó un mensaje adicional."}"

                Saludos,
                {admin_u}
            """
        elif(type == "Felicitacion"):
            message = f"""
                Hola {user.first_name.split(" ")[0]}:

                Se te envió una felicitación con el siguiente mensaje:

                "{message if message is not None and message != "" else "No se proporcionó un mensaje adicional."}"

                Saludos,
                {admin_u}
            """
        elif(type == "Recomendacion"):
            message = f"""
                Hola {user.first_name.split(" ")[0]}:

                Se te envió una recomendación con el siguiente mensaje:

                "{message if message is not None and message != "" else "No se proporcionó un mensaje adicional."}"

                Saludos,
                {admin_u}
            """
        if type is not None and title is not None and message is not None:
            try:
                instance = Notification.objects.create(
                    user=user,
                    type=type,
                    title=title,
                    message=message,
                    admin_u=admin_u
                )
                serializer = NotificacionSerializer(instance)
                return Response(serializer.data, status=201)
            except Exception as e:
                return Response({'error': str(e)}, status=500)
        else:
            return Response({'error': 'Datos inválidos'}, status)
        
    
    @swagger_auto_schema(
        operation_summary="Listar todos los objetos Notificación",
    )

    def get(self, request, *args, **kwargs):
        # Listar todos los objetos
        queryset = Notification.objects.filter(user=request.user).order_by('id')
        serializer = NotificacionSerializer(queryset, many=True)
        return Response(serializer.data)
    
   
class NotificacionAPIView(APIView):

    """
    Vista para manejar operaciones de listado y recuperación de notificaciones basadas en el tipo de solicitud.
    """
    permission_classes = [IsAuthenticated]  # Asegura que solo los usuarios autenticados puedan acceder
    
    
    @swagger_auto_schema(
        operation_summary="Recuperar un solo objeto Notificación",
        responses={
            200: NotificacionSerializer,
            404: "Objeto no encontrado"
        }
    )
    def get(self, request, *args, **kwargs):
        id = kwargs.get('id')
        if id is not None:
            # Recuperar un solo objeto
            try:
                instance = Notification.objects.get(id=id)
                if(instance.user != request.user):
                    return Response({'error': 'La notificación no pertenece al usuario'}, status=400)
                serializer = NotificacionSerializer(instance)
                return Response(serializer.data)
            except Problema.DoesNotExist:
                return Response({'error': 'Objeto no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        else:
          return Response({'error': 'ID no proporcionado.'}, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Marcar una notificación como leída",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['id'],  # Especificar los campos requeridos aquí
            properties={
                'id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID de la notificación'),
            },
        ),
        responses={
            200: "Notificación marcada como leída",
            400: "Datos inválidos"
        }
    )
    def put(self, request, *args, **kwargs):
        notification_id = kwargs.get('id')
        notification = Notification.objects.get(id=notification_id)
        if(notification.user != request.user):
            return Response({'error': 'La notificación no pertenece al usuario'}, status=400)
        notification.read_status = True
        notification.save()
        return Response({'message': 'Notificación marcada como leída'}, status=200)
    
    @swagger_auto_schema(
        operation_summary="Eliminar una notificación",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
        ),
        responses={
            200: "Notificación eliminada exitosamente",
            400: "Datos inválidos"
        }
    )
    def delete(self, request, *args, **kwargs):
        try:
            # Analizar el cuerpo JSON
            notification_id = kwargs.get('id')

            # Verificar si se proporciona el ID
            if not notification_id:
                return Response({'error': 'ID de notificación no proporcionado'}, status=400)
            
            try:
                # Recuperar la notificación por ID
                notification = Notification.objects.get(id=notification_id)
                if(notification.user != request.user):
                    return Response({'error': 'La notificación no pertenece al usuario'}, status=400)
                notification.delete()
                return Response({'message': 'Notificación eliminada exitosamente'}, status=200)
            
            except ObjectDoesNotExist:
                return Response({'error': 'Notificación no encontrada'}, status=404)
        
        except json.JSONDecodeError:
            return Response({'error': 'JSON inválido'}, status=400)
        
        except Exception as e:
            return Response({'error': str(e)}, status=500)  
        

class ProblemasAPIView(APIView):
    """
    Vista para manejar operaciones de listado y recuperación de problemas basadas en el tipo de solicitud.
    """
    permission_classes = [IsAuthenticated]  # Asegura que solo los usuarios autenticados puedan acceder

    @swagger_auto_schema(
        operation_summary="Listar todos los objetos Problema",
        responses = {
            200: ProblemaSerializer,
            404: "Objeto no encontrado"
        }
    )
    def get(self, request, *args, **kwargs):
        # Obtener todos los objetos
        queryset = Problema.objects.all().select_related('id_usuario').order_by('id')
        
        # Procesar la consulta para formatear las fechas y agregar el nombre de usuario si el usuario es personal
        problemas = []
        for problema in queryset:
            problema_dict = ProblemaSerializer(problema).data
            problema_dict['fecha_creacion'] = problema.fecha_creacion.astimezone(timezone).strftime('%d/%m/%Y')
            problema_dict['fecha_actualizado'] = problema.fecha_actualizado.astimezone(timezone).strftime('%d/%m/%Y %H:%M:%S')
            if request.user.is_staff:
                problema_dict['user_name'] = problema.id_usuario.first_name
            
            problemas.append(problema_dict)
        
        return Response(problemas)
    
    @swagger_auto_schema(
        operation_summary="Crear un nuevo objeto Problema",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['id_usuario', 'tipo_edificio', 'tipo_problema', 'gravedad_problema', 'descripcion_problema', 'ubicacion_exacta'],  # Especificar los campos requeridos aquí
            properties={
                'id_usuario': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID del usuario'),
                'tipo_edificio': openapi.Schema(type=openapi.TYPE_STRING, description='Tipo de edificio'),
                'estatus_problematica': openapi.Schema(type=openapi.TYPE_STRING, description='Estado del problema', default='Procesando'),
                'letra_edificio': openapi.Schema(type=openapi.TYPE_STRING, description='Letra del edificio', default=None, blank=True, null=True),
                'numero_salon': openapi.Schema(type=openapi.TYPE_INTEGER, description='Número del salón', default=None, blank=True, null=True),
                'piso_baño': openapi.Schema(type=openapi.TYPE_STRING, description='Piso del baño', default=None, blank=True, null=True),
                'tipo_baño': openapi.Schema(type=openapi.TYPE_STRING, description='Tipo de baño', default=None, blank=True, null=True,),
                'edificio_baño': openapi.Schema(type=openapi.TYPE_STRING, description='Edificio del baño', default=None, blank=True, null=True),
                'tipo_area': openapi.Schema(type=openapi.TYPE_STRING, description='Tipo de área común', default=None, blank=True, null=True),
                'ubicacion_area': openapi.Schema(type=openapi.TYPE_STRING, description='Ubicación del área común', default=None, blank=True, null=True),
                'tipo_departamento': openapi.Schema(type=openapi.TYPE_STRING, description='Tipo de departamento', default=None, blank=True, null=True),
                'tipo_edificio_departamento': openapi.Schema(type=openapi.TYPE_STRING, description='Tipo de edificio para departamento', default=None, blank=True, null=True),
                'ubicacion_departamento': openapi.Schema(type=openapi.TYPE_STRING, description='Ubicación del departamento', default=None, blank=True, null=True),
                'tipo_problema': openapi.Schema(type=openapi.TYPE_STRING, description='Tipo de problema'),
                'gravedad_problema': openapi.Schema(type=openapi.TYPE_STRING, description='Gravedad del problema'),
                'descripcion_problema': openapi.Schema(type=openapi.TYPE_STRING, description='Descripción del problema'),
                'ubicacion_exacta': openapi.Schema(type=openapi.TYPE_STRING, description='Ubicación exacta del problema', default=None, blank=True, null=True),
            },
        ),
        responses={
            201: ProblemaSerializer,
            400: "Datos inválidos"
        }
    )

    def post(self, request, *args, **kwargs):
        tipoEdificio = request.POST.get("tipo_edificio")

        if tipoEdificio == "Academico":
            form = formAcademicos(request.POST)
        elif tipoEdificio == "Baños":
            form = formBaños(request.POST)
        elif tipoEdificio == "Áreas comunes":
            form = formAreasComunes(request.POST)
        elif tipoEdificio == "Departamento":
            form = formDepartamento(request.POST)
        

        if form.is_valid():
            
            if "ubicacion_exacta" in request.FILES:
            
                file = request.FILES["ubicacion_exacta"]
                # Configuration       
                cloudinary.config( 
                    cloud_name = "ddtcisnd8", 
                    api_key = "198492183157911", 
                    api_secret = "uer3QQQHJFBGfxmsEAiRYhYwxQE", # Click 'View API Keys' above to copy your API secret
                    secure=True
                )

                # Upload an image
                upload_result = cloudinary.uploader.upload(file,
                                                        public_id=f"{request.user.id}_{datetime.now()}")
                
             
                print(upload_result["secure_url"])



            data = form.cleaned_data
            data['id_usuario'] = request.user.id
            data['ubicacion_exacta'] = upload_result["secure_url"]
            serializer = ProblemaSerializer(data=data)
            if serializer.is_valid():
                report = serializer.save()
                reporteEnProceso = ProblemaEnCursoSerializer(data={
                    'id_problema': report.id,
                    'id_administrador': 1,
                    'info_adicional': '...'
                })
                if reporteEnProceso.is_valid():
                    reporteEnProceso.save()
                else:
                    return Response(reporteEnProceso.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(reporteEnProceso.errors, status=status.HTTP_400_BAD_REQUEST)

            return HttpResponseRedirect('/user/reportar?success=true')
        
        return HttpResponseRedirect('/user/reportar?success=false')
        
 
class ProblemaAPIView(APIView):
    """
    Vista para manejar operaciones de listado y recuperación de problemas basadas en el tipo de solicitud.
    """
    permission_classes = [IsAuthenticated]  # Asegura que solo los usuarios autenticados puedan acceder

    @swagger_auto_schema( 
        operation_summary="Recuperar un solo objeto Problema",
        responses = {
            200: ProblemaSerializer,
            404: "Objeto no encontrado"
        }
    )
    def get(self, request, *args, **kwargs):
        id = kwargs.get('id')
        if id is not None:
            # Recuperar un solo objeto
            try:
                instance = Problema.objects.get(id=id)
                serializer = ProblemaSerializer(instance)
                return Response(serializer.data)
            except Problema.DoesNotExist:
                return Response({'error': 'Objeto no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        else:
          return Response({'error': 'ID no proporcionado.'}, status=status.HTTP_400_BAD_REQUEST)
    

    @swagger_auto_schema(
        operation_summary="Cambiar el estado del problema",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['estatus'],  # Especificar los campos requeridos aquí
            properties={
                'estatus': openapi.Schema(type=openapi.TYPE_STRING, description='Estado del problema'),
                'info_adicional' : openapi.Schema(type=openapi.TYPE_STRING, description='Información adicional del problema', default='...'),
                'comentario_completado' : openapi.Schema(type=openapi.TYPE_STRING, description='Comentario de completado del problema', default='...'),
            },
        ),
        responses={
            201: ProblemaSerializer,
            400: "Datos inválidos"
        }
    )
    def put(self, request, *args, **kwargs):
        id = kwargs.get('id')
        estatus = request.data['estatus']
        info_adicional = request.data.get("info_adicional")
        comentario_completado = request.data.get("comentario_completado")
        if id is not None:
            try:
                instance = Problema.objects.get(id=id) #accediendo a la tabla problemas
                problemaEnCurso = ProblemaEnCurso.objects.get(id_problema=instance)
                problemaEnCurso.id_administrador = request.user
                instance.estatus_problematica = estatus
                adminComentario = "Tu problema fue atendido por el administrador"
                if info_adicional is None or info_adicional == "":
                    problemaEnCurso.info_adicional = "Tu problema fue atendido por el administrador"
                if info_adicional is not None and info_adicional != "":
                    problemaEnCurso.info_adicional = info_adicional
                    adminComentario = info_adicional



                if estatus == "Completado":
                    if problemaEnCurso.fecha_completado == None:
                        problemaEnCurso.fecha_completado = datetime.now()
                    if comentario_completado is not None and comentario_completado != "":
                        problemaEnCurso.comentario_completado = comentario_completado
                        adminComentario = comentario_completado
                    if comentario_completado is None or comentario_completado == "":
                        adminComentario = "Tu problema fue completado con exito gracias por reportar"
                        problemaEnCurso.comentario_completado = adminComentario
                
                
                Notification.objects.create(
                                            user=instance.id_usuario,
                                            admin_u=request.user.first_name,
                                            type='Problema',
                                            title='Problema ' + estatus,
                                            message=(
                                                f'Su problema {instance.tipo_edificio} | {instance.tipo_problema} con el ID#{id} fue {estatus} '
                                                f'por el administrador {request.user.first_name} {request.user.last_name}. '
                                                f'El mensaje enviado fue: "{adminComentario}"'
                                                    )
                                            )
                instance.save()
                problemaEnCurso.save()
                return Response({'message': 'Estado cambiado'}, status=200)
                
            except Problema.DoesNotExist:
                return Response({'error': 'Objeto no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'ID no proporcionado.'}, status=status.HTTP_400_BAD_REQUEST)
   

class ProblemasEnCursoAPIView(APIView):
    """
    Vista para manejar operaciones de listado y recuperación de problemas en curso basadas en el tipo de solicitud.
    """
    permission_classes = [IsAuthenticated]  # Asegura que solo los usuarios autenticados puedan acceder

    @swagger_auto_schema(
        operation_summary="Listar todos los objetos Problema en Curso",
        responses = {
            200: ProblemaSerializer,
            404: "Objeto no encontrado"
        }
    )
    def get(self, request, *args, **kwargs):
        # Listar todos los objetos
        queryset = ProblemaEnCurso.objects.all().order_by('id').iterator()
       
        # Procesar la consulta para formatear las fechas y agregar el nombre de usuario si el usuario es personal
        problemas = []
        for problema in queryset:
            problema_dict = ProblemaEnCursoSerializer(problema).data
            if problema_dict['fecha_aceptado'] is not None:
                problema_dict['fecha_aceptado'] = problema.fecha_aceptado.astimezone(timezone).strftime('%d/%m/%Y %H:%M:%S')
            if problema_dict['fecha_completado'] is not None:
                problema_dict['fecha_completado'] = problema.fecha_completado.astimezone(timezone).strftime('%d/%m/%Y %H:%M:%S')
            problemas.append(problema_dict)
        
        return Response(problemas)
    
    
class ProblemaEnCursoAPIView(APIView):
    """
     Vista para manejar operaciones de listado y recuperación de usuarios basadas en el tipo de solicitud.
    """
    permission_classes = [IsAuthenticated]  # Asegura que solo los usuarios autenticados puedan acceder
    @swagger_auto_schema(
    operation_summary="Recuperar un solo objeto Problema en Curso con el ID del problema",
        responses={
            200: ProblemaSerializer,
            404: "Objeto no encontrado"
        }
    )


    def get(self, request, *args, **kwargs):
        id_problema = kwargs.get('id_problema')
        if id_problema is not None:
            # Recuperar un solo objeto
            try:
                instance = ProblemaEnCurso.objects.get(id_problema=id_problema)
                serializer = ProblemaEnCursoSerializer(instance)
                dict = serializer.data.copy()
                problema = Problema.objects.get(id=dict['id_problema'])

                dict['problema'] = ProblemaSerializer(problema).data
                dict['problema']['fecha_creacion'] = problema.fecha_creacion.astimezone(timezone).strftime('%d/%m/%Y %H:%M:%S')
                dict['problema']['fecha_actualizado'] = problema.fecha_actualizado.astimezone(timezone).strftime('%d/%m/%Y %H:%M:%S')
            
                if dict['fecha_aceptado'] is not None:
                    dict['fecha_aceptado'] = instance.fecha_aceptado.astimezone(timezone).strftime('%d/%m/%Y %H:%M:%S')
                if dict['fecha_completado'] is not None:
                    dict['fecha_completado'] = instance.fecha_completado.astimezone(timezone).strftime('%d/%m/%Y %H:%M:%S')
                if instance.id_administrador is not None:
                    dict['adminName'] = instance.id_administrador.first_name
                    dict['id_administrador'] = instance.id_administrador.first_name
                dict.pop('id_problema', None)

                return Response(dict)
            except ProblemaEnCurso.DoesNotExist:
                return Response({'error': 'Objeto no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'ID no proporcionado.'}, status=status.HTTP_400_BAD_REQUEST)

class UsuariosAPIView(APIView):
    """
    Vista para manejar operaciones de listado y recuperación de usuarios basadas en el tipo de solicitud.
    """
    permission_classes = [IsAuthenticated]  # Asegura que solo los usuarios autenticados puedan acceder

    @swagger_auto_schema(
        operation_summary="Listar todos los objetos Usuario",
        responses = {
            200: UsuarioSerializer,
            404: "Objeto no encontrado"
        }
    )
    def get(self, request, *args, **kwargs):
        # Listar todos los objetos
        queryset = CustomUser.objects.annotate(
            num_reportes=Count('problema', filter=Q(problema__id_usuario=F('id')))
        ).order_by('id')
        
         # Preparar la lista de usuarios
        usuarios_data = []
        for user in queryset:
            if (user.fecha_baneo is not None):
                user.fecha_baneo = user.fecha_baneo.astimezone(timezone).strftime('%d/%m/%Y %H:%M:%S')
            usuarios_data.append({
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'is_superuser': user.is_superuser,
                'is_staff': user.is_staff,
                'is_active': user.is_active,
                'date_joined': user.date_joined.astimezone(timezone).strftime('%d/%m/%Y %H:%M:%S'),
                'num_reportes': user.num_reportes,
                'fecha_baneo' : user.fecha_baneo
                # Agrega otros campos necesarios aquí
            })
        
        # Devolver la respuesta en formato JSON
        return JsonResponse(usuarios_data, safe=False)
    
    @swagger_auto_schema(
        operation_summary="Cambiar datos de usuario y contraseña",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['password', 'current_password'],  # Especificar los campos requeridos aquí
            properties={
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Nueva contraseña'),
                'current_password': openapi.Schema(type=openapi.TYPE_STRING, description='Contraseña actual'),
            },
        ),
        responses={
            200: "Contraseña cambiada",
            400: "Datos inválidos"
        }
    )
    def put(self, request, *args, **kwargs):
        id = request.user.id;
        email = request.user.email
        password = request.data['password']
        current_password = request.data['current_password']
        if id is not None:
            try:
                instance = CustomUser.objects.get(id=id)
                if not instance.check_password(current_password):
                    return Response({'error': 'Contraseña inválida'}, status=status.HTTP_400_BAD_REQUEST)
                instance.set_password(password)
                instance.save()
                user = authenticate(email = email,  password =  password)
                login(request, user)
                return Response({'message': 'Contraseña cambiada'}, status=200)
                
            except CustomUser.DoesNotExist:
                return Response({'error': 'Objeto no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'ID no proporcionado.'}, status=status.HTTP_400_BAD_REQUEST)

    
class UsuarioAPIView(APIView):
    """
    Vista para manejar operaciones de listado y recuperación de usuarios basadas en el tipo de solicitud.
    """
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access
    @swagger_auto_schema(
        operation_summary="Mostrar un solo objeto Usuario",
        responses = {
            200: UsuarioSerializer,
            404: "Objeto no encontrado"
        }
    )
    def get(self, request, *args, **kwargs):

        if not request.user.is_staff:
            return Response({'error': 'No tienes permiso para realizar esta acción'}, status=status.HTTP_403_FORBIDDEN)
        

        id = kwargs.get('id')
        if id is not None:
            # Retrieve a single object
            try:
                instance = CustomUser.objects.get(id=id)
                serializer = UsuarioSerializer(instance)
                return Response(serializer.data)
            except CustomUser.DoesNotExist:
                return Response({'error': 'Object not found.'}, status=status.HTTP_404_NOT_FOUND)
        else:
          return Response({'error': 'ID not provided.'}, status=status.HTTP_400_BAD_REQUEST)
        
    @swagger_auto_schema(
            operation_summary="Cambiar datos de usuario y contraseña desde el Administrador",
            request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'first_name': openapi.Schema(type=openapi.TYPE_STRING, description='Nombres'),
                'last_name': openapi.Schema(type=openapi.TYPE_STRING, description='Apellidos'),
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='Nueva contraseña'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Nueva contraseña'),
                'is_staff': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Administrador/booleano'),
                'is_active': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Activo/booleano'),
            },
        ),
        responses={
            200: "Contraseña cambiada",
            400: "Datos inválidos"
        }
    )
    def put(self, request, *args, **kwargs):

        if not request.user.is_staff:
            return Response({'error': 'No tienes permiso para realizar esta acción'}, status=status.HTTP_403_FORBIDDEN)
        
        if len(request.data) == 0:
            return Response({'error': 'No se proporcionaron datos'}, status=status.HTTP_400_BAD_REQUEST)
        
        id = kwargs.get('id')
        password =  request.data.get('password', None)
        first_name = request.data.get('first_name', None)
        last_name = request.data.get('last_name', None)
        email = request.data.get('email', None)
        is_staff = request.data.get('is_staff', None)
        is_active = request.data.get('is_active', None)

        for data in request.data:
            if data == "":
                data = None

        if id is not None:
            try:
                instance = CustomUser.objects.get(id=id)
                instance.first_name = first_name if first_name is not None else instance.first_name
                instance.last_name = last_name if last_name is not None else instance.last_name
                instance.email = email if email is not None else instance.email
                instance.is_staff = is_staff if is_staff is not None else instance.is_staff
                instance.is_active = is_active if is_active is not None else instance.is_active
                if(password is not None):
                    instance.set_password(password )
                instance.save()
                return Response({'message': 'Datos del usuario cambiados'}, status=200)
                
            except CustomUser.DoesNotExist:
                return Response({'error': 'Objeto no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'ID no proporcionado.'}, status=status.HTTP_400_BAD_REQUEST)
        
class BanUser(APIView):
    """
    Vista para manejar operaciones de banear usuarios basadas en el tipo de solicitud.
    """
    permission_classes = [IsAuthenticated]  # Asegura que solo los usuarios autenticados puedan acceder
    @swagger_auto_schema(
        operation_summary="Banear un usuario",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['duracion', 'razon'],  # Especificar los campos requeridos aquí
            properties={
                'duracion': openapi.Schema(type=openapi.TYPE_INTEGER, description='Tiempo de baneo en días'),
                'razon': openapi.Schema(type=openapi.TYPE_STRING, description='Razón del baneo'),
            },
        ),
        responses={
            200: "Usuario baneado",
            400: "Datos inválidos"
        }
    )
    def put(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({'error': 'No tienes permiso para realizar esta acción'}, status=status.HTTP_403_FORBIDDEN)
         
        id = kwargs.get('id')
        duracion = request.data.get('duracion', None)
        razon = request.data.get('razon', None)

        if id is not None:
            try:
                instance = CustomUser.objects.get(id=id)
                banUser = int(duracion) > 0;
                instance.is_active = False if banUser else True
                instance.fecha_baneo = datetime.now()
                if duracion is not None:
                    instance.fecha_baneo += timedelta(days=int(duracion))
                instance.save()

                Notification.objects.create(
                    user=instance,
                    admin_u=request.user.first_name + " " + request.user.last_name,
                    type='Ban' if banUser else 'Unban',
                    title='Usuario baneado' if banUser else 'Usuario desbaneado',
                    message=(
                        f"""  Usuario: {instance.first_name} {instance.last_name}
                              Razón: {razon}
                              Duración del Baneo: Actualmente estás baneado por {duracion} días.
                        """ if banUser else f"""  Usuario: {instance.first_name} {instance.last_name}
                              Razón: {razon}
                              Duración del Baneo: Actualmente estás desbaneado.
                        """
                    )
                )
                return Response({'message': 'Usuario baneado'}, status=200)
                
            except CustomUser.DoesNotExist:
                return Response({'error': 'Objeto no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'ID no proporcionado.'}, status=status.HTTP_400_BAD_REQUEST)