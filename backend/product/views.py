from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import ProductSerializer
from .models import Buyer, Seller, Product

# Obtenir la liste de tous les produits
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_products_all(request):
    products = Product.objects.all()  # Récupère tous les produits
    serializer = ProductSerializer(products, many=True)  # Sérialise les données
    return Response(serializer.data)  # Retourne les données JSON

# Obtenir le stock d'un produit par son nom
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stock(request):
    name = request.query_params.get('name', None)  # Récupère le paramètre 'name' de la requête
    if not name:
        return Response({"error": "Nom du produit requis"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        product = Product.objects.get(name=name)  # Recherche du produit par nom
        return Response({"name": product.name, "stock": product.quantity})  # Retourne le stock
    except Product.DoesNotExist:
        return Response({"error": "Produit non trouvé"}, status=status.HTTP_404_NOT_FOUND)  # Produit introuvable

# Obtenir la liste des produits correspondants à la recherche et triés par prix 
@api_view(['GET'])
def get_products(request):
    name = request.query_params.get('name', None)
    if not name:
        return Response({"error": "Nom du produit requis"}, status=status.HTTP_400_BAD_REQUEST)

    # Rechercher et trier les produits par prix croissant
    products = Product.objects.filter(name__icontains=name, quantity__gt=0).order_by('price')

    if not products.exists():
        return Response({"error": f"Aucun produit trouvé pour '{name}'"}, status=status.HTTP_404_NOT_FOUND)

    # Construire la réponse JSON
    products_data = [
        {
            "name": product.name,
            "price": float(product.price),  # Convertir Decimal en float
            "producer": product.seller.username,  # 🔹 Utiliser seller.username
            "stock": float(product.quantity),  # 🔹 Utiliser quantity
            "category": product.category,
            "origin": product.origin,
            "sale_type": product.sale_type,
            "description": product.description,
        }
        for product in products
    ]
    return Response(products_data)

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)  # Génère un token JWT
        return Response({
            "message": "Connexion réussie",
            "user": user.username,
            "access": str(refresh.access_token),  # 🔹 Retourne le token JWT
            "refresh": str(refresh)  # 🔹 Token de rafraîchissement (optionnel)
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Identifiants invalides"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def register_user(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        user_type = request.data.get('user_type')  # Assurez-vous que cela correspond à votre modèle ou logique

        if not username or not password:
            return Response({"error": "Nom d'utilisateur et mot de passe requis"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Ce nom d'utilisateur est déjà pris"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(password)
        except ValidationError as e:
            return Response({"error": e.messages}, status=status.HTTP_400_BAD_REQUEST)

        # Crée un utilisateur dans la base de données
        user = User.objects.create(
            username=username,
            password=make_password(password)  # Hash du mot de passe pour la sécurité
        )

        # Ajoutez une logique spécifique au type d'utilisateur, si nécessaire
        if user_type == "seller":
            seller = Seller.objects.create(user=user)
            buyer = Buyer.objects.create(user=user)  # un vendeur peut aussi acheter s'il le souhaite
        elif user_type == "buyer":
            buyer = Buyer.objects.create(user=user)
        user.save()

        return Response({"message": "Utilisateur créé avec succès"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def get_user_role(request):
    username = request.GET.get('username')
    
    try:
        user = User.objects.get(username=username)
        if Seller.objects.filter(user=user).exists():  # check seller first (sellers are always buyers too but not the contrary)
            return JsonResponse({"role": "seller"})
        elif Buyer.objects.filter(user=user).exists():
            return JsonResponse({"role": "buyer"})
        else:
            return JsonResponse({"role": "unknown"})
    except User.DoesNotExist:
        return JsonResponse({"error": "Utilisateur non trouvé"}, status=404)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_product(request):
    if not Seller.objects.filter(user=request.user).exists():
        return Response({"error": "Seuls les vendeurs peuvent ajouter des produits"}, status=status.HTTP_403_FORBIDDEN)

    data = request.data.copy()
    data['seller'] = request.user.id
    serializer = ProductSerializer(data=data)
    if serializer.is_valid():
        serializer.save()  # Associe le produit au vendeur
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)