# Producteur Local (Locali)

Marketplace de circuit-court : des **producteurs locaux** publient des produits (fruits, légumes,
viande, produits laitiers, céréales...) avec prix, origine et stock ; des **acheteurs** peuvent
rechercher ces produits, les mettre en favoris et les commander via un panier.

## Stack

- **Backend** : Django 6 + Django REST Framework, auth JWT (`djangorestframework-simplejwt`),
  base de données **MySQL** (`produits_db`).
- **Frontend** : React (Vite) + React Router, appels API via `axios`.

## Structure

```
backend/backend/       # settings.py, urls.py (config du projet Django)
backend/product/       # app principale : models, views, urls, serializers
frontend/src/pages/     # une page par route (HomePage, LoginPage, SellingPage, MyCart, ...)
frontend/src/components/ # Header, Footer, SearchBar
frontend/src/context/    # AuthContext.jsx (existe mais pas encore branché dans App.jsx)
```

### Modèles (`backend/product/models.py`)

- `Product` : name, seller (FK User), category, price, origin, sale_type (piece/weight),
  quantity, description.
- `Buyer` / `Seller` : profils liés à un `User` Django (un vendeur est toujours aussi acheteur).

### Endpoints (`backend/product/urls.py`)

- `GET /products/get_products/?name=` — recherche par nom, triée par prix, publique.
- `GET /products/all/` — tous les produits (auth requise).
- `GET /products/stock/?name=` — stock d'un produit (auth requise).
- `POST /products/create_product/` — créer un produit (auth + rôle vendeur requis).
- `POST /products/login/`, `POST /products/register/`, `GET /products/user_role/`.
- `POST /products/token/`, `POST /products/token/refresh/` — JWT.

## Où on en est

### Fait
- Environnement de dev fonctionnel en local (venv Python 3.14 recréée dans `env_python/`,
  Node.js installé, MySQL tourne en local sur le port 3306).
- `.claude/launch.json` configuré pour lancer `backend` (Django, port 8000) et `frontend`
  (Vite, port 5173) via l'outil de preview.
- Dépôt Git initialisé et poussé (le premier commit a été fait par l'utilisateur via GitHub
  Desktop).

### Sécurité — corrigée
- Endpoint `add_product` (POST public sans auth, doublon de `create_product`) supprimé.
- `create_product` vérifie désormais que l'utilisateur est un `Seller` (403 sinon).
- Logs de debug qui exposaient le token JWT en clair côté serveur retirés.
- `SECRET_KEY` et mot de passe MySQL sortis du code, chargés depuis `backend/.env`
  (non versionné, cf. `backend/.gitignore`). Utilise `python-dotenv`.
- `CORS_ALLOW_ALL_ORIGINS` remplacé par `CORS_ALLOWED_ORIGINS` restreint à
  `localhost:5173` / `127.0.0.1:5173`.
- `register_user` valide le mot de passe avec les validators Django (`AUTH_PASSWORD_VALIDATORS`)
  et rejette les noms d'utilisateur déjà pris.
- `get_products_all` et `get_stock` exigent désormais l'authentification.
- Bug corrigé : `get_stock` référençait `product.stock` (inexistant) au lieu de
  `product.quantity` — provoquait une 500 systématique.

### À faire (par ordre de priorité proposé)

1. **Flux de commande complet** (le plus bloquant : sans ça on ne peut rien acheter réellement)
   - Créer un modèle `Order` (+ `OrderItem`) côté backend.
   - Décrémenter `Product.quantity` au moment de la commande.
   - Remplacer le `alert("Commande confirmée !")` de `MyCart.jsx` par un vrai appel API.
   - Brancher `OrdersPage.jsx` sur les vraies commandes de l'utilisateur (actuellement
     page statique).
2. **Favoris persistés** — `FavoritesPage.jsx` est une page statique, pas de modèle `Favorite`
   côté backend, pas d'endpoints add/remove/list.
3. **Session persistante** — `isLoggedIn`/`userRole` sont de simples `useState` dans `App.jsx`,
   perdus au rechargement de la page alors que le JWT reste dans `localStorage`.
   `AuthContext.jsx` existe déjà mais n'est pas utilisé : à brancher pour restaurer la session
   au chargement (lire le token, appeler `/products/user_role/`, etc.).
4. **Recherche** — `get_products` renvoie une 404 si aucun résultat au lieu d'un tableau vide
   en 200 (peu idiomatique pour une recherche). Pas de filtre catégorie/prix côté UI, pas de
   pagination.
5. **UI/UX** — interface très minimale, pas de vrai système de style. À prioriser selon le
   niveau de finition visé.

## Notes d'environnement

- La venv `env_python/` référençait un Python 3.11.9 qui n'existe plus sur la machine ; elle a
  été recréée avec Python 3.14 (seule version installée). Si l'environnement redevient cassé,
  la recréer avec `python -m venv env_python` puis `pip install -r requirements.txt`.
- MySQL doit tourner en local (port 3306) pour que le backend démarre sans erreur de connexion
  DB — pas de `runserver` possible sans ça (le check Django passe, mais les requêtes DB
  échoueront).
- Node.js (LTS) a été installé via `winget` — absent de la machine à l'origine.
