from rest_framework import serializers
from user.models import Problema, ProblemaEnCurso, Notification
from login.models import CustomUser
import pytz

timezone = pytz.timezone('America/Mexico_City')


class ProblemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problema
        fields = '__all__'
        
class ProblemaEnCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemaEnCurso
        fields = '__all__'

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        exclude = ['password']  # Excluir el campo 'password'
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.date_joined:
            representation['date_joined'] = instance.date_joined.astimezone(timezone).strftime('%d/%m/%Y')
        return representation