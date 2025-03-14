from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Color, Medication, Reminder
from .serializers import ColorSerializer, MedicationSerializer, ReminderSerializer


class ColorViewSet(viewsets.ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
    

class MedicationViewSet(viewsets.ModelViewSet):
    queryset = Medication.objects.all()
    serializer_class = MedicationSerializer


class ReminderViewSet(viewsets.ModelViewSet):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer


