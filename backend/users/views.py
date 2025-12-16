from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from api.email_adapter import BrevoEmailService
from django.utils import timezone
from datetime import timedelta
import uuid
from django.contrib.auth.hashers import check_password, make_password
from dj_rest_auth.registration.views import RegisterView
from .serializers import CustomRegisterSerializer
import secrets

User = get_user_model()

class VerifyEmailView(APIView):
    permission_classes = []

    def post(self, request):
        key = request.data.get("key")
        code = request.data.get("code")

        if not key or not code:
            return Response(
                {"detail": "Key and code are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            user = User.objects.get(email_verification_key=key)
        except User.DoesNotExist:
            return Response(
                {"detail": "Invalid verification key"},
                status=status.HTTP_400_BAD_REQUEST,
    )
        
        if not user.email_verification_code_expires_at or timezone.now() > user.email_verification_code_expires_at:
            return Response(
                {"detail": "Verification code expired"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if user.email_verification_attempts >= 5:
            return Response(
                {"detail": "Too many attempts. Please resend a new code."},
                status=429
            )

        if not check_password(code, user.email_verification_code):
            user.email_verification_attempts += 1
            user.save(update_fields=["email_verification_attempts"])
            return Response(
                {"detail": "Invalid verification code"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ Verify email
        user.is_email_verified = True
        user.email_verification_code = None
        user.email_verification_code_expires_at = None
        user.email_verification_sent_at = None
        user.email_verification_attempts = 0
        user.email_verification_key = uuid.uuid4()
        user.save()


        # ✅ Issue JWT
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_email_verified": user.is_email_verified,
            }
        })
    
class ResendVerificationCodeView(APIView):
    permission_classes = []

    def post(self, request):
        key = request.data.get("key")

        if not key:
            return Response(
                {"detail": "Verification key is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            user = User.objects.get(email_verification_key=key)
        except User.DoesNotExist:
            return Response(
                {"detail": "Invalid verification key"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        if user.email_verification_sent_at:
            delta = timezone.now() - user.email_verification_sent_at
            if delta.total_seconds() < 90:
                return Response(
                    {
                        "detail": "Please wait before requesting another code",
                        "retry_after": int(90 - delta.total_seconds()),
                    },
                    status=status.HTTP_429_TOO_MANY_REQUESTS,
                )


        if user.is_email_verified:
            return Response(
                {"detail": "Email already verified"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 🔁 Generate new 6-digit code
        raw_code = f"{secrets.randbelow(900000) + 100000}"


        user.email_verification_code = make_password(raw_code)
        user.email_verification_code_expires_at = timezone.now() + timedelta(minutes=10)
        user.email_verification_sent_at = timezone.now()
        user.email_verification_attempts = 0

        # 📧 Send email again
        adapter = BrevoEmailService()
        adapter.send_confirmation_mail(request, user, raw_code=raw_code)

        user.save(update_fields=[
            "email_verification_code",
            "email_verification_code_expires_at",
            "email_verification_sent_at",
            "email_verification_attempts"
        ])

        return Response(
            {"detail": "Verification code resent"},
            status=status.HTTP_200_OK,
        )

class CustomRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(request)

        return Response(
            {
                "key": str(user.email_verification_key)
            },
            status=status.HTTP_201_CREATED
        )

class LoginAPIView(APIView):
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"detail": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(request, username=username, password=password)

        if not user:
            return Response({"detail": "Invalid Credentials"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not user.is_email_verified:
            return Response({"detail": "Email not verified"}, status=status.HTTP_400_BAD_REQUEST)
        
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return Response({
            "access": str(access),
            "refresh": str(refresh),
            "user": {
                "pk": user.pk,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
            }
        })