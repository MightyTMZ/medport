from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
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


@api_view(['GET'])
def get_reminders_by_medication(request, medication_id):
    try:
        reminders = Reminder.objects.filter(medication_id=medication_id)
        
        if not reminders.exists():
            return Response({"message": "No reminders found for this medication."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReminderSerializer(reminders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)