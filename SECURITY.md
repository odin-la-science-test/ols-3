# Sécurité - Odin la Science

## Vue d'ensemble

Odin la Science implémente une architecture de sécurité multi-couches pour protéger les données sensibles des utilisateurs et prévenir les attaques courantes.

## Fonctionnalités de sécurité

### 1. Cryptage des données

#### Cryptage AES-256-GCM
- **Algorithme**: AES-256-GCM (Advanced Encryption Standard - Galois/Counter Mode)
- **Longueur de clé**: 256 bits
- **Dérivation de clé**: PBKDF2 avec 100,000 itérations
- **Salt**: 16 bytes aléatoires par opération
- **IV (Initialization Vector)**: 12 bytes aléatoires par opération

#### Données cryptées
- Données utilisateur sensibles
- Messages et communications
- Résultats d'expériences
- Informations de laboratoire
- Fichiers uploadés

### 2. Gestion des sessions

#### Tokens de session
- Génération de tokens sécurisés (64 bytes)
- Expiration automatique après 24 heures
- Rafraîchissement automatique toutes les 5 minutes
- Détection d'inactivité (30 minutes)

#### Validation
- Vérification de la validité à chaque requête
- Destruction automatique des sessions expirées
- Nettoyage des données sensibles à la déconnexion

### 3. Protection CSRF

- Token CSRF unique par session
- Validation sur toutes les requêtes POST/PUT/DELETE
- Régénération après chaque connexion
- Stockage sécurisé en sessionStorage

### 4. Rate Limiting

#### Limites par action
- **Connexion**: 5 tentatives par minute
- **API**: 100 requêtes par minute
- **Inscription**: 3 tentatives par heure

#### Verrouillage
- Verrouillage temporaire après dépassement
- Durée: 15 minutes pour les tentatives de connexion

### 5. Validation des mots de passe

#### Politique de mot de passe
- Minimum 8 caractères
- Au moins une majuscule
- Au moins une minuscule
- Au moins un chiffre
- Au moins un caractère spécial

#### Hachage
- Algorithme: SHA-256
- Salage automatique
- Pas de stockage en clair

### 6. Protection XSS

- Sanitization automatique des entrées utilisateur
- Échappement HTML sur toutes les données affichées
- Content Security Policy (CSP) stricte
- Validation des types de contenu

### 7. Headers de sécurité

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### 8. Content Security Policy

```
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval'
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src 'self' https://fonts.gstatic.com
img-src 'self' data: https:
connect-src 'self' https://api.odin-la-science.com
frame-ancestors 'none'
base-uri 'self'
form-action 'self'
```

### 9. Audit et logging

#### Événements audités
- Connexions réussies/échouées
- Déconnexions
- Changements de mot de passe
- Accès aux données sensibles
- Modifications de données
- Changements de permissions

#### Stockage des logs
- Logs en mémoire (limités à 1000 entrées)
- Envoi au serveur en production
- Horodatage précis
- Identification de l'utilisateur

### 10. Sécurité des fichiers

#### Restrictions d'upload
- Taille maximale: 10 MB
- Types autorisés:
  - Images: JPEG, PNG, GIF
  - Documents: PDF
  - Données: CSV, Excel
- Scan antivirus (à implémenter côté serveur)

## Utilisation

### Cryptage manuel

```typescript
import { encryptData, decryptData } from './utils/encryption';

// Crypter des données
const encrypted = await encryptData('données sensibles', 'mot-de-passe');

// Décrypter des données
const decrypted = await decryptData(encrypted, 'mot-de-passe');
```

### Stockage sécurisé

```typescript
import { SecureStorage } from './utils/encryption';

// Sauvegarder
await SecureStorage.setItem('key', { data: 'value' }, 'password');

// Récupérer
const data = await SecureStorage.getItem('key', 'password');
```

### Gestion de session

```typescript
import { SessionManager } from './utils/encryption';

// Créer une session
const token = SessionManager.createSession('userId');

// Valider la session
const isValid = SessionManager.validateSession();

// Détruire la session
SessionManager.destroySession();
```

### Protection CSRF

```typescript
import { CSRFProtection } from './utils/encryption';

// Générer un token
const token = CSRFProtection.generateToken();

// Valider un token
const isValid = CSRFProtection.validateToken(token);
```

## Bonnes pratiques

### Pour les développeurs

1. **Ne jamais stocker de données sensibles en clair**
   - Toujours utiliser le cryptage
   - Utiliser SecureStorage pour localStorage

2. **Valider toutes les entrées utilisateur**
   - Utiliser sanitizeInput()
   - Valider les formats (email, etc.)

3. **Vérifier les sessions**
   - Valider avant chaque opération sensible
   - Rafraîchir régulièrement

4. **Utiliser HTTPS en production**
   - Obligatoire pour le cryptage
   - Protège contre les attaques MITM

5. **Implémenter le rate limiting**
   - Sur toutes les actions sensibles
   - Ajuster selon les besoins

### Pour les utilisateurs

1. **Utiliser un mot de passe fort**
   - Minimum 8 caractères
   - Mélange de types de caractères

2. **Se déconnecter après utilisation**
   - Surtout sur ordinateurs partagés
   - Nettoie les données sensibles

3. **Vérifier l'URL**
   - Toujours HTTPS en production
   - Vérifier le certificat SSL

4. **Signaler les comportements suspects**
   - Tentatives de connexion non autorisées
   - Activités inhabituelles

## Conformité

### RGPD
- Cryptage des données personnelles
- Droit à l'oubli (suppression complète)
- Consentement explicite
- Portabilité des données

### ISO 27001
- Gestion des accès
- Cryptage des données
- Audit et traçabilité
- Gestion des incidents

## Signalement de vulnérabilités

Si vous découvrez une vulnérabilité de sécurité, veuillez nous contacter immédiatement:

- Email: security@odin-la-science.com
- Ne pas divulguer publiquement avant correction
- Délai de réponse: 48 heures

## Mises à jour

Ce document est mis à jour régulièrement. Dernière mise à jour: Février 2026

## Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [RGPD](https://www.cnil.fr/fr/reglement-europeen-protection-donnees)
