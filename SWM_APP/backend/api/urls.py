from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    UserViewSet,
    WasteReportViewSet,
    CollectionRouteViewSet,
    ReportStatusView,
    HazardousAlertView,
    ProtectedView,
    DashboardViewSet,
    UserMeView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView  # ✅ Custom login view
)


urlpatterns = [
    # ✅ Include all ViewSet routes
    #path('', include(router.urls)),

    # ✅ Authentication endpoints (matches frontend calls)
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    # ✅ Authenticated user info
    path('users/me/', UserMeView.as_view(), name='user-me'),

    # ✅ Role/feature-specific endpoints
    path('protected-endpoint/', ProtectedView.as_view(), name='protected'),
    path('report-status/<int:report_id>/', ReportStatusView.as_view(), name='report-status'),
    path('hazardous-alerts/', HazardousAlertView.as_view(), name='hazardous-alerts'),
    path('dashboard/', DashboardViewSet.as_view({'get': 'list'}), name='dashboard'),
]



# ✅ Router for all ViewSets
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'waste-reports', WasteReportViewSet, basename='wastereport')
router.register(r'collection-routes', CollectionRouteViewSet, basename='collectionroute')

urlpatterns += router.urls