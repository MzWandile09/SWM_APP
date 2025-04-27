#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def create_user(self, email, password=None, **extra_fields):
    user = self.model(email=email, **extra_fields)  # Define the user instance
    if password:
        user.set_password(password)  # Ensure this line exists
    user.save(using=self._db)

def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "waste_app.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == "__main__":
    main()