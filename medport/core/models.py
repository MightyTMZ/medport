from django.db import models
import datetime


class Medication(models.Model):
    FREQUENCY_TIME_INTERVALS = [
        ("DAY", "Daily"),
        ("HOUR", "Hourly"),
        ("WEEK", "Weekly"),
        ("BI-WEEK", "Bi-weekly"),
    ]

    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to="media/medication_images")
    frequency = models.PositiveSmallIntegerField(help_text="How often to take it (e.g., every 8 hours)")
    frequency_time_interval = models.CharField(
        max_length=20, choices=FREQUENCY_TIME_INTERVALS, default="DAY"
    )

    def __str__(self):
        return self.name


class Reminder(models.Model):
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE, related_name="reminders")
    time = models.TimeField(help_text="Time of day when the reminder should go off")
    repeat_interval = models.PositiveSmallIntegerField(
        default=1, help_text="Repeat every X hours/days (e.g., every 2 hours)"
    )
    repeat_days = models.JSONField(
        blank=True, null=True,
        help_text="Specific days to repeat (e.g., ['Monday', 'Wednesday'])"
    )
    specific_date = models.DateField(blank=True, null=True, help_text="If for a specific date only")
    active = models.BooleanField(default=True, help_text="Enable or disable the reminder")
    snooze_duration = models.PositiveSmallIntegerField(
        default=10, help_text="Snooze in minutes (e.g., 10 min snooze)"
    )

    def is_due(self):
        """Check if the reminder is due"""
        now = datetime.datetime.now().time()
        return self.active and self.time <= now

    def __str__(self):
        return f"{self.medication.name} - {self.time}"