import random
from faker import Faker
from .models import Problema, ProblemaEnCurso
from login.models import CustomUser

# # Configuración de Django si estás ejecutando el script fuera de Django
# settings.configure()
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
# django.setup()

faker = Faker()

# Lista de valores posibles para los campos
tipo_edificio = ['Academico', 'Baños', 'Áreas comunes', 'Departamento']
tipos_problema = ['Eléctrico', 'Físico', 'Humedad', 'Ventilación', 'Electrodomésticos']
gravedad_problemas = ['Menor', 'Moderado', 'Serio', 'Crítico']

# Datos reales de salones por edificio
salon_count = {
    'A': 0,
    'B': 9,
    'C': 9,
    'D': 0,
    'E': 20,
    'F': 10,
    'G': 2,
    'H': 0,
    'I': 8,
    'J': 0,
    'K': 1,
    'L': 0,
    'M': 0,
    'N': 0,
    'O': 0,
    'P': 23,
    'Q': 25,
    'R': 8,
    'S': 0,
    'S2': 0,
    'T': 0,
    'U': 14,
    'V1': 19,
    'V2': 3,
    'W': 5,
    'X': 22,
    'Y': 0,
    'Z': 0,
    'ALFA': 10,
    'BETA': 10
}

# Datos reales de baños
datos_baños = {
    'HOMBRE': {'A': 1, 'C': 1, 'E': 1, 'S2': 1, 'X': 1, 'ALFA': 1, 'BETA': 1},
    'MUJER': {'A': 1, 'C': 1, 'E': 1, 'I': 1, 'S2': 1, 'T': 1, 'V1': 2, 'V2': 1, 'Y': 1, 'ALFA': 1, 'BETA': 1},
}

# Tipos de área para el tipo de edificio 'Área Común'
tipos_area_comun = ['Área Verde', 'Comedor', 'Estacionamiento']

# Opciones para tipos de departamento
departamento_options = {
    "Administrativos": [
        "Unidad de Planeación", "Unidad de Presupuesto", "Unidad de Servicio Social", 
        "Auditorio Antonio Rodríguez", "Jefatura del departamento de Ingeniería Química", 
        "Museo de mineralogía", "Servicios médicos integrales", 
        "COMITÉ DE ALUMOS DE LA DIVISIÓN DE CIENCIAS BÁSICAS", "MAESTRÍA EN CIENCIAS QUÍMICAS", 
        "UNIDAD DE VINCULACIÓN", "UNIDAD INTERNA DE PROTECCIÓN CIVIL", 
        "DIVISIÓN DE CIENCIAS BÁSICAS", "RADIO CUCEI", 
        "Auditorio Antonio Alatorre", "Departamento de Ingeniería Industrial", 
        "Departamento de Ciencias Computacionales", 
        "Departamento de Ingeniería Civil y Topográfica", 
        "Departamento de Ingeniería Mecánica Eléctrica", 
        "División de Electrónica y Computación", "División Ingenierías", 
        "Sala de maestros de electrónica y computación", 
        "Maestría en Ciencias en Ingeniería Electrónica y Computación", 
        "Oficinas de investigadores", "Oficinas del STAUdeG", 
        "Aula de posgrados en Ciencias de la Hidrometeorología", 
        "Departamento de Matemáticas", "Maestría en Ciencias en Química", 
        "Salas audiovisuales", "Sala de lectura de Matemáticas", 
        "Comité de Computación", "Comité de Física", 
        "Comité de Informática", "Comité de Matemáticas", 
        "Oficina 1", "Oficinas del servicio social"
    ],
    "Coordinacion": [
        "Computación", "Electrónica", "Coordinación de Comisiones del Consejo de Centro", 
        "Coordinación de Control Escolar", "Coordinación de Extensión", 
        "Coordinación de Finanzas", "Coordinación de Personal", 
        "Coordinación de Servicios Académicos", "Coordinación de Servicios Generales", 
        "Coordinación de la licenciatura de Ingeniería Química", 
        "Coordinacion de la maestría en Sistemas de Calidad", 
        "Coordinación de licenciatura en Ingeniería en Computación", 
        "Coordinación de licenciatura en Informática", 
        "Coordinación de licenciatura en Ingeniería Biomédica", 
        "Coordinación de licenciatura en Ingeniería en Comunicaciones y Electrónica", 
        "Coordinación de Ingeniería Mecánica Eléctrica", 
        "Coordinación de licenciatura en Ingeniería Industrial", 
        "Coordinación de licenciatura en Ingeniería Topográfica", 
        "Coordinación de la licenciatura en Física", 
        "Coordinación de la licenciatura en Matemáticas"
    ],
    "Cubiculos": ['Ubicación'],  # Añadir las ubicaciones de cubículos si están disponibles
    "Biblioteca": ['Biblioteca']  # Añadir las ubicaciones de biblioteca si están disponibles
}

# Obtener todos los usuarios
usuarios = CustomUser.objects.all()

def get_salon_count(edificio):
    return salon_count.get(edificio, 0)

def get_bano_data(tipo_bano):
    return datos_baños.get(tipo_bano, {})

def get_departamento_data(tipo_departamento):
    return departamento_options.get(tipo_departamento, [])

# Generar reportes falsos
def crear_reportes_falsos(num_reportes):
    for _ in range(num_reportes):
        usuario = random.choice(usuarios)
        tipo_edificio_actual = random.choice(tipo_edificio)
        
        # Crear el problema basado en el tipo de edificio
        problema_data = {
            'id_usuario': usuario,
            'tipo_edificio': tipo_edificio_actual,
            'estatus_problematica': 'Procesando',
            'tipo_problema': random.choice(tipos_problema),
            'gravedad_problema': random.choice(gravedad_problemas),
            'descripcion_problema': faker.text(),
        }

        # Agregar campos específicos según el tipo de edificio
        if tipo_edificio_actual == 'Académico':
            edificio_actual = faker.random_element(elements=list(salon_count.keys()))
            salones_asignados = get_salon_count(edificio_actual)
            max_salon = 25 - salones_asignados  # Calcula el máximo de salones permitidos

            problema_data.update({
                'letra_edificio': edificio_actual,
                'numero_salon': faker.random_int(min=1, max=max_salon) if max_salon > 0 else 0,
            })
        elif tipo_edificio_actual == 'Baño':
            tipo_bano = random.choice(['HOMBRE', 'MUJER'])
            edificios_disponibles = get_bano_data(tipo_bano)
            if edificios_disponibles:
                edificio_bano = faker.random_element(elements=list(edificios_disponibles.keys()))
                piso_bano = edificios_disponibles.get(edificio_bano)

                problema_data.update({
                    'tipo_baño': tipo_bano,
                    'edificio_baño': edificio_bano,
                    'piso_baño': piso_bano,
                })
            else:
                problema_data.update({
                    'tipo_baño': tipo_bano,
                    'edificio_baño': 'Desconocido',
                    'piso_baño': 0,
                })
        elif tipo_edificio_actual == 'Área Común':
            problema_data.update({
                'tipo_area': random.choice(tipos_area_comun),
                'ubicacion_area': faker.address(),
            })
        elif tipo_edificio_actual == 'Departamento':
            tipo_departamento = random.choice(['Administrativos', 'Coordinacion', 'Cubiculos', 'Biblioteca'])
             # Añadir el tipo_departamento al diccionario problema_data
            problema_data.update({
                'tipo_departamento': tipo_departamento
            })
    
            if tipo_departamento in ['Administrativos', 'Coordinacion']:
                problema_data.update({
                    'tipo_edificio_departamento': random.choice(get_departamento_data(tipo_departamento)),
                })
            else:
                problema_data.update({
                    'ubicacion_departamento': random.choice(get_departamento_data(tipo_departamento)),
                })
                

        problema = Problema.objects.create(**problema_data)

        # Crear un ProblemaEnCurso inmediatamente después de crear el Problema
        ProblemaEnCurso.objects.create(
            id_problema=problema,
            id_administrador=random.choice(usuarios) if random.choice([True, False]) else None,
            info_adicional=faker.text(),
            fecha_completado=faker.date_time_this_year() if random.choice([True, False]) else None,
            comentario_completado=faker.text() if random.choice([True, False]) else None,
        )

