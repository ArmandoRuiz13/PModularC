# Generated by Django 5.0.2 on 2024-04-30 10:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_problemas_edificio_baño'),
    ]

    operations = [
        migrations.AlterField(
            model_name='problemas',
            name='estatus_problematica',
            field=models.CharField(default='procesando', max_length=100),
        ),
    ]