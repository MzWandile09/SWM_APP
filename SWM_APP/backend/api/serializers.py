# SWM__APP/backend/api/serializers.py

from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Users, WasteReport, CollectionRoute

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['user_id', 'first_name', 'last_name', 'email', 'phone', 'user_role', 'password']
        extra_kwargs = {
            'user_role': {'read_only': True},
            'password': {'write_only': True, 'required': False},

            'email': {'required': False},
            'phone': {'required': False},
            'user_role': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False}
        }

    def validate(self, data):
        request = self.context.get('request')
        instance = getattr(self, 'instance', None)

         

        if self.instance:  # Update operation
            required_fields = []
            # Preserve existing values if not provided in update
            if 'phone' not in data:
                data['phone'] = self.instance.phone
            if 'email' not in data:
                data['email'] = self.instance.email
            if 'user_role' not in data:
                data['user_role'] = self.instance.user_role
        else:  # Create operation
            required_fields = ['first_name', 'last_name', 'email', 'phone', 'user_role']
            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError({field: 'This field is required'})

        # Check for duplicate phone (only if phone is being updated)
        if 'phone' in data and Users.objects.filter(phone=data['phone']).exclude(pk=getattr(instance, 'pk', None)).exists():
            raise serializers.ValidationError({'phone': 'Phone number already registered'})

        # Check for duplicate email (only if email is being updated)
        if 'email' in data and Users.objects.filter(email=data['email']).exclude(pk=getattr(instance, 'pk', None)).exists():
            raise serializers.ValidationError({'email': 'Email already registered'})

        # Only validate user_role if it's being updated
        if 'user_role' in data:
            valid_roles = ['Resident', 'Clerk', 'Driver', 'Manager', 'Admin']
            if data['user_role'] not in valid_roles:
                raise serializers.ValidationError({
                    'user_role': f'Invalid role. Valid options: {", ".join(valid_roles)}'
                })
            
            # Role permission checks
            if request:
                if not request.user.is_authenticated:
                    if data['user_role'] != 'Resident':
                        raise serializers.ValidationError({
                            'user_role': 'Signup is only allowed for Resident role.'
                        })
                elif request.user.user_role != 'Admin' and data['user_role'] in ['Admin', 'Manager']:
                    raise serializers.ValidationError({
                        'user_role': 'Permission denied for this role.'
                    })

        return data

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
    
    def perform_create(self, serializer):
        # Remove set_password here; serializer handles hashing
        serializer.save()


class WasteReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteReport
        fields = '__all__'
        extra_kwargs = {
            'resident': {
                'read_only': True,
                'default': serializers.CurrentUserDefault()  # Auto-set current user
            }
        }


# SWM__APP/backend/api/serializers.py
class CollectionRouteSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source='driver.get_full_name', read_only=True)
    clerk_name = serializers.CharField(source='clerk.get_full_name', read_only=True)
    status = serializers.CharField(required=False)
    reports = serializers.PrimaryKeyRelatedField(
        queryset=WasteReport.objects.all(),
        many=True,
        required=False
    )

    class Meta:
        model = CollectionRoute
        fields = [
            'route_id', 'driver', 'clerk', 'reports',
            'driver_name', 'clerk_name', 'status',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'driver': {'required': True},
            'clerk': {
                'read_only': True,
                'default': serializers.CurrentUserDefault()
            }
        }

    def validate_driver(self, value):
        if value.user_role != 'Driver':
            raise serializers.ValidationError("Assigned user must be a Driver")
        return value

    def create(self, validated_data):
        validated_data['clerk'] = self.context['request'].user
        return super().create(validated_data)




