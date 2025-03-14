from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'colors', views.ColorViewSet)
router.register(r'medications', views.MedicationViewSet)
router.register(r'reminders', views.ReminderViewSet)

urlpatterns = [
    path('', include(router.urls)), 
    path('reminders/by-medication/<int:medication_id>/', views.get_reminders_by_medication, name='reminders-by-medication'),
    path("medication/create", views.CreateMedication.as_view()),
    path("medication/edit", views.EditMedication.as_view()),

]