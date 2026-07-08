from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
# from .models import Buyer, Seller

# @receiver(post_save, sender=User)
# def create_user_profiles(sender, instance, created, **kwargs):
#     if created:
#         # Remplacez selon vos besoins (par défaut, on crée un Buyer)
#         Buyer.objects.create(user=instance)

# @receiver(post_save, sender=User)
# def save_user_profiles(sender, instance, **kwargs):
#     if hasattr(instance, 'buyer_profile'):
#         instance.buyer_profile.save()
#     if hasattr(instance, 'seller_profile'):
#         instance.seller_profile.save()
