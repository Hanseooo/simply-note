from django.shortcuts import render
import os
from rest_framework.decorators import api_view
from rest_framework.response import Response


CRON_SECRET_TOKEN = os.getenv("CRON_SECRET_TOKEN")

# Create your views here.
@api_view(["GET"])
def health_check(request):
    """
    Simple health check endpoint for cron-job.
    """
    token = request.GET.get("secret")
    if token != CRON_SECRET_TOKEN:
        return Response({"error": "unauthorized"}, status=401)

    return Response({"status": "ok"})