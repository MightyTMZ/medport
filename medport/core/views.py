from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import *


class ColorViewSet(viewsets.ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
    

class MedicationViewSet(viewsets.ModelViewSet):
    queryset = Medication.objects.all()
    serializer_class = MedicationSerializer


class CreateMedication(APIView):
    def post(self, request):
        serializer = CreateMedicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class EditMedication(APIView):
    def put(self, request, medication_id):
        medication = get_object_or_404(Medication, id=medication_id)
        serializer = MedicationSerializer(medication, data=request.data)  # Full update
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, medication_id):
        medication = get_object_or_404(Medication, id=medication_id)
        serializer = MedicationSerializer(medication, data=request.data, partial=True)  # Partial update
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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