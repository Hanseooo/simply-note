from rest_framework.views import exception_handler
from ai.exceptions import AIQuotaExceeded

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if isinstance(exc, AIQuotaExceeded):
        return response 

    return response
