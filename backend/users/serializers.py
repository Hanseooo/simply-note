from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from dj_rest_auth.serializers import LoginSerializer
from .models import User
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.hashers import make_password
from api.email_adapter import BrevoEmailService
import secrets
from  rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class CustomRegisterSerializer(RegisterSerializer):
    username = serializers.CharField(required=True)

    def validate_username(self, username):
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username already taken")
        return username

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already registered")
        return email
    
    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password1"],
        )
        # Generate 6-digit verification code
        raw_code = f"{secrets.randbelow(900000) + 100000}" 

        user.email_verification_code = make_password(raw_code)
        user.email_verification_code_expires_at = timezone.now() + timedelta(minutes=10)
        user.email_verification_sent_at = timezone.now()
        user.email_verification_attempts = 0
        user.save()

        # Send verification email
        adapter = BrevoEmailService()
        adapter.send_confirmation_mail(self.context['request'], user, raw_code=raw_code)
        return user


class CustomLoginSerializer(LoginSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user
        if not user.is_email_verified:
            raise serializers.ValidationError({
                "detail": "Email not verified",
                "email_verified": False,
                "user_id": user.id,
            })
        
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        data.update({
            "access": str(access),
            "refresh": str(refresh)
        })

        return data
