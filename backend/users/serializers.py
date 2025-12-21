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


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    password = serializers.CharField(min_length=8)



class ChangeUsernameSerializer(serializers.Serializer):
    username = serializers.CharField()

    def validate_username(self, username):
        user = self.context["request"].user
        if User.objects.filter(username=username).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("Username already taken")
        return username



class ChangeEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already in use")
        return email


class ChangeEmailConfirmSerializer(serializers.Serializer):
    code = serializers.CharField(min_length=6, max_length=6)


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField()
    new_password = serializers.CharField(min_length=8)

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect")
        return value

    def validate_new_password(self, value):
        # Optional: prevent reusing same password
        user = self.context["request"].user
        if user.check_password(value):
            raise serializers.ValidationError(
                "New password must be different from the current password"
            )
        return value
