'''

ColorSerializer
MedicationSerializer
ReminderSerializer

'''

from rest_framework import serializers
from .models import *


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = [
            'id',
            'name',
            'red_val',
            'green_val',
            'blue_val',
        ]


class SimpleReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = [
            'id'
            'time',
            'repeat_interval',
            'repeat_days',
            'specific_date',
            'active',
            'snooze_duration',
        ]



class MedicationSerializer(serializers.ModelSerializer):
    color = ColorSerializer()
    reminders = SimpleReminderSerializer(many=True)

    class Meta:
        model = Medication
        fields = [
            'id',
            'name',
            'image',
            'color',
            'frequency',
            'frequency_time_interval',
            'reminders',
        ]


class ReminderSerializer(serializers.ModelSerializer):
    medication = MedicationSerializer()

    class Meta:
        model = Reminder
        fields = [
            'id',
            'medication',
            'time',
            'repeat_interval',
            'repeat_days',
            'specific_date',
            'active',
            'snooze_duration',
        ]

