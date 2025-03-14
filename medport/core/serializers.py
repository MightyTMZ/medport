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
            'id',
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


class CreateMedicationSerializer(serializers.ModelSerializer):
    color = ColorSerializer()  # Keeps color as a nested field
    reminders = SimpleReminderSerializer(many=True)

    class Meta:
        model = Medication
        fields = [
            'name',
            'image',
            'color',
            'frequency',
            'frequency_time_interval',
            'reminders',
        ]

    def create(self, validated_data):
        color_data = validated_data.pop('color')  # Extract color data
        reminders_data = validated_data.pop('reminders', [])  # Extract reminders data

        color_instance, _ = Color.objects.get_or_create(**color_data)  # Use existing or create new

        medication = Medication.objects.create(color=color_instance, **validated_data)

        for reminder_data in reminders_data:
            Reminder.objects.create(medication=medication, **reminder_data)

        return medication


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


class CreateReminderSerializer(serializers.ModelSerializer):
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


