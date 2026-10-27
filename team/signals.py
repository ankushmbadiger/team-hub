from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Membership


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_membership(sender, instance, created, **kwargs):
    if created:
        Membership.objects.create(
            user=instance,
            role=Membership.Role.ADMIN if instance.is_superuser else Membership.Role.MEMBER,
            must_change_password=not instance.is_superuser,
        )
