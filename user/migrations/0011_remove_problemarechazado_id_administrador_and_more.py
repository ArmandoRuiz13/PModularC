# Generated by Django 5.0.2 on 2024-05-31 22:55

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0010_rename_fecha_completado_problemaaceptado_fecha_aceptado'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='problemarechazado',
            name='id_administrador',
        ),
        migrations.RemoveField(
            model_name='problemarechazado',
            name='id_problema',
        ),
        migrations.CreateModel(
            name='ProblemaEnCurso',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('info_adicional', models.TextField(blank=True)),
                ('fecha_aceptado', models.DateTimeField(auto_now_add=True)),
                ('fecha_completado', models.DateTimeField(blank=True, null=True)),
                ('comentario_completado', models.TextField(blank=True)),
                ('id_administrador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('id_problema', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.problema')),
            ],
        ),
        migrations.DeleteModel(
            name='ProblemaAceptado',
        ),
        migrations.DeleteModel(
            name='ProblemaRechazado',
        ),
    ]
