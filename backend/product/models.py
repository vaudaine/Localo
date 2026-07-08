from django.contrib.auth.models import User
from django.db import models

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('Fruits', 'Fruits'),
        ('Légumes', 'Légumes'),
        ('Viande', 'Viande'),
        ('Produits laitiers', 'Produits laitiers'),
        ('Céréales', 'Céréales'),
        ('Autre', 'Autre'),
    ]
    name = models.CharField(max_length=255)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name="auth_user")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    origin = models.CharField(max_length=255)
    sale_type = models.CharField(max_length=10, choices=[('piece', 'À la pièce'), ('weight', 'Au poids')])
    quantity = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category} - {self.price}€"

    class Meta:
        db_table = 'products'  # Nom explicite de la table

class Buyer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='buyer_profile')
    phone = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return f"Buyer: {self.user.username}"
    
    class Meta:
        db_table = 'clients'

class Seller(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='seller_profile')
    phone = models.CharField(max_length=15, blank=True)
    adress = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"Seller: {self.user.username}"

    class Meta:
        db_table = 'producers'