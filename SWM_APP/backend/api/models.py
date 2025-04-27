# swm__app/backend/api/models.py
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('user_role', 'Admin')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
            
        return self.create_user(email, password, **extra_fields)

class Users(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(
        unique=True,
        max_length=255,
        blank=False,
        null=False,
        error_messages={'unique': 'This email is already registered.'}
    )
    first_name = models.CharField(max_length=45)
    last_name = models.CharField(max_length=45)
    phone = models.CharField(unique=True, max_length=45)
    user_role = models.CharField(max_length=45)
    
    is_active = models.BooleanField(default=True)
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='api_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='api_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone']
    objects = CustomUserManager()

    

    class Meta:
        db_table = 'users'

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

class WasteReport(models.Model):
    REPORT_TYPES = [
        ('Hazardous', 'Hazardous'), 
        ('Recyclable', 'Recyclable'), 
        ('General', 'General')
    ]
    
    report_id = models.AutoField(primary_key=True)
    resident = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    photo = models.ImageField(upload_to='waste_reports/')
    gps_lat = models.DecimalField(max_digits=9, decimal_places=6)
    gps_lon = models.DecimalField(max_digits=9, decimal_places=6)
    waste_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    description = models.TextField()
    status = models.CharField(max_length=20, default='Reported')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'waste_reports'

class CollectionRoute(models.Model):
    STATUS_CHOICES = [
        ('Planned', 'Planned'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Delayed', 'Delayed'),
    ]
    
    route_id = models.AutoField(primary_key=True)
    driver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'user_role': 'Driver'},
        related_name='driver_routes'
    )
    clerk = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'user_role__in': ['Clerk', 'Manager']},
        related_name='clerk_routes'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Planned')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reports = models.ManyToManyField(WasteReport, related_name='collection_routes')

    class Meta:
        db_table = 'collection_routes'

