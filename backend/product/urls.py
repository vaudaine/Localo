from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('get_products/', views.get_products, name='get_products'),  # Route pour obtenir la liste des produits correspondants à la recherche et triés par prix
    path('stock/', views.get_stock, name='get_stock'),  # Route pour obtenir le stock d'un produit
    path('all/', views.get_products_all, name='get_products_all'),  # Route pour obtenir tous les produits
    path('login/', views.login_view, name='login'),  # Route pour la connexion
    path('register/', views.register_user, name='register'),  # Route pour s'enregistrer
    path('user_role/', views.get_user_role, name='user_role'),  # Route pour avoir le role d'un utilisateur
    path('create_product/', views.create_product, name='create_product'),  # Route pour ajouter un produit à vendre
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
