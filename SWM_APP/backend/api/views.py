from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers, viewsets, status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.db import IntegrityError
from rest_framework_simplejwt.views import TokenRefreshView

from django.db.models import Q 
from .models import Users, WasteReport, CollectionRoute
from .serializers import UserSerializer, WasteReportSerializer, CollectionRouteSerializer
from .permissions import IsClerkOrAbove, IsManagerOrAbove, IsDriver, IsOwnerOrAdmin, IsAdminUser
from .permissions import IsManagerOrAdmin

# ✅ LOGIN AUTH ENDPOINT (JWT Token)
class CustomTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(username=attrs['email'], password=attrs['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        if not user.is_active:
            raise serializers.ValidationError("Account disabled")

        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.user_id,
            'email': user.email,
            'user_role': user.user_role,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# ✅ AUTHENTICATED USER DETAILS (/users/me/)
class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "user_id": user.user_id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "user_role": user.user_role,
            "phone": user.phone
        })
    
    

# ✅ USERS CRUD (with correct permissions)
# api/views.py
class UserViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        if self.action == 'list':
            return [IsManagerOrAdmin()]
        if self.action in ['retrieve', 'update', 'partial_update']:
            return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
        return [permissions.IsAuthenticated(), IsAdminUser()]

    def get_queryset(self):
        if self.request.user.user_role == 'Manager':
            return Users.objects.filter(
                Q(user_role='Clerk') | 
                Q(user_role='Driver') |
                Q(user_role='Manager')  # Add managers to visible users
            ).exclude(user_role='Admin')  # Explicitly exclude admins
        return super().get_queryset()

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"error": "Email already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)  # Allow partial updates
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


# ✅ Waste Reports (only for the logged-in resident)
class WasteReportViewSet(viewsets.ModelViewSet):
    serializer_class = WasteReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WasteReport.objects.filter(resident=self.request.user)

    def perform_create(self, serializer):
        serializer.save(resident=self.request.user)


# ✅ Collection Route Logic based on user role
class CollectionRouteViewSet(viewsets.ModelViewSet):
    serializer_class = CollectionRouteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        role = self.request.user.user_role
        if role == 'Driver':
            return CollectionRoute.objects.filter(driver=self.request.user)
        elif role in ['Clerk', 'Manager']:
            return CollectionRoute.objects.filter(
                Q(clerk=self.request.user) |
                Q(status__in=['Planned', 'In Progress'])
            )
        elif role == 'Admin':
            return CollectionRoute.objects.all()
        return CollectionRoute.objects.none()

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        route = self.get_object()
        new_status = request.data.get('status')

        valid_transitions = {
            'Planned': ['In Progress'],
            'In Progress': ['Completed', 'Delayed'],
            'Delayed': ['In Progress']
        }

        if new_status in valid_transitions.get(route.status, []):
            route.status = new_status
            route.save()
            return Response({'status': 'Updated'})
        return Response({'error': 'Invalid transition'}, status=status.HTTP_400_BAD_REQUEST)


# ✅ Report Status for Residents
class ReportStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, report_id):
        report = get_object_or_404(WasteReport, pk=report_id)
        return Response({
            'status': report.status,
            'assigned_route': report.collectionroute_set.first().route_id
                             if report.collectionroute_set.exists()
                             else None
        })


# ✅ Clerk & Manager: View Hazardous Waste Reports
class HazardousAlertView(APIView):
    permission_classes = [IsClerkOrAbove]

    def get(self, request):
        reports = WasteReport.objects.filter(waste_type='Hazardous')
        serializer = WasteReportSerializer(reports, many=True)
        return Response(serializer.data)


# ✅ Dashboard View (generic)
class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        user = request.user
        data = {
            "user_info": {
                "name": f"{user.first_name} {user.last_name}",
                "role": user.user_role,
                "email": user.email
            },
            "stats": {}  # Optional: Add role-based stats
        }
        return Response(data)


# ✅ Protected test endpoint
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Authenticated successfully!"})


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 401:
            response.data = {
                'detail': 'Refresh token expired or invalid',
                'code': 'token_not_valid'
            }
        return response