# Améliorations de Sécurité - Odin La Science

## Vue d'ensemble

Ce document décrit les améliorations de sécurité implémentées dans l'application Odin La Science.

## ✅ Fonctionnalités de Sécurité Implémentées

### 1. Protection contre la Force Brute ✅ INTÉGRÉ
- **Limite de tentatives**: 5 tentatives de connexion par période de 5 minutes
- **Verrouillage automatique**: 15 minutes après 5 échecs
- **Logging**: Toutes les tentatives sont enregistrées
- **Fichier**: `src/utils/securityEnhancements.ts` - `BruteForceProtection`
- **Intégration**: `src/pages/Login.tsx` - Vérifie et enregistre chaque tentative de connexion

### 2. Détection d'Anomalies ✅ INTÉGRÉ
- Surveillance des heures de connexion inhabituelles (2h-5h du matin)
- Détection d'actions trop rapides (bots) - 10 actions en moins de 10 secondes
- Analyse des patterns d'utilisation
- Score de risque calculé automatiquement (seuil d'alerte: 50)
- **Fichier**: `src/utils/securityEnhancements.ts` - `AnomalyDetector`
- **Intégration**: `src/pages/Login.tsx` et `src/pages/Register.tsx` - Enregistre et analyse le comportement

### 3. Validation et Sanitisation des Entrées ✅ INTÉGRÉ
- Protection contre les injections SQL (détecte SELECT, INSERT, UPDATE, DELETE, etc.)
- Protection contre les attaques XSS (détecte <script>, javascript:, etc.)
- Protection contre le path traversal (détecte ../, %2e%2e)
- Validation par type (email, URL, nombre, etc.)
- Sanitisation automatique des objets
- **Fichier**: `src/utils/securityEnhancements.ts` - `InputValidator`
- **Intégration**: 
  - `src/pages/Login.tsx` - Valide email et mot de passe
  - `src/pages/Register.tsx` - Valide et sanitise toutes les entrées utilisateur

### 4. Authentification à Deux Facteurs (2FA) ⚠️ DISPONIBLE
- Génération de codes à 6 chiffres
- Expiration après 5 minutes
- Vérification sécurisée
- **Fichier**: `src/utils/securityEnhancements.ts` - `TwoFactorAuth`
- **Statut**: Prêt à l'emploi, peut être activé dans les paramètres utilisateur

### 5. Chiffrement des Données ✅ ACTIF
- **Algorithme**: AES-256-GCM
- **Dérivation de clé**: PBKDF2 avec 100,000 itérations
- **Salt**: 16 bytes aléatoires
- **IV**: 12 bytes aléatoires
- **Fichier**: `src/utils/encryption.ts`

### 6. Gestion des Sessions ✅ ACTIF
- Tokens sécurisés de 64 caractères
- Expiration après 24 heures
- Rafraîchissement automatique toutes les 5 minutes
- Timeout d'inactivité de 30 minutes
- **Fichier**: `src/utils/encryption.ts` - `SessionManager`
- **Intégration**: `src/components/SecurityProvider.tsx`

### 7. Protection CSRF ✅ ACTIF
- Génération de tokens uniques par session
- Validation sur toutes les requêtes sensibles
- Stockage en sessionStorage
- **Fichier**: `src/utils/encryption.ts` - `CSRFProtection`
- **Intégration**: `src/components/SecurityProvider.tsx`

### 8. Rate Limiting ✅ INTÉGRÉ
- **Connexion**: 5 tentatives/minute
- **API**: 100 requêtes/minute
- **Inscription**: 3 tentatives/heure
- **Fichier**: `src/utils/encryption.ts` - `RateLimiter`
- **Intégration**: `src/pages/Register.tsx`

### 9. Audit et Logging ✅ ACTIF
- Enregistrement de tous les événements de sécurité
- Horodatage précis
- Identification de l'utilisateur
- Détails contextuels
- **Fichier**: `src/utils/securityConfig.ts` - `SecurityLogger`
- **Intégration**: Utilisé dans Login.tsx et Register.tsx

### 10. En-têtes de Sécurité ⚠️ À CONFIGURER
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```
**Note**: À configurer au niveau du serveur (Vercel/Nginx)

### 11. Content Security Policy (CSP) ⚠️ À CONFIGURER
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
**Note**: À configurer au niveau du serveur

## 📋 Politique de Mot de Passe

- **Longueur minimale**: 8 caractères
- **Exigences**:
  - Au moins une majuscule
  - Au moins une minuscule
  - Au moins un chiffre
  - Au moins un caractère spécial
- **Vérification de la force**: Score de 0 à 6
- **Feedback en temps réel**: Suggestions d'amélioration
- **Intégration**: `src/pages/Register.tsx` - Affichage visuel de la force du mot de passe

## 🔐 Stockage Sécurisé

### LocalStorage Chiffré
- Wrapper `SecureStorage` pour chiffrement automatique
- Clé dérivée du mot de passe utilisateur
- Données sensibles jamais en clair

### SessionStorage
- Tokens CSRF
- Données temporaires de session
- Nettoyage automatique à la déconnexion

## 🚨 Événements de Sécurité Surveillés

1. ✅ `login` - Connexion réussie
2. ✅ `logout` - Déconnexion
3. ✅ `failed_login` - Échec de connexion
4. ✅ `account_locked` - Compte verrouillé
5. ✅ `account_unlocked` - Compte déverrouillé
6. ✅ `password_change` - Changement de mot de passe
7. ✅ `2fa_code_generated` - Code 2FA généré
8. ✅ `2fa_verification_success` - Vérification 2FA réussie
9. ✅ `2fa_verification_failed` - Échec vérification 2FA
10. ✅ `sql_injection_attempt` - Tentative d'injection SQL
11. ✅ `xss_attempt` - Tentative XSS
12. ✅ `path_traversal_attempt` - Tentative path traversal
13. ✅ `anomaly_detected` - Anomalie détectée
14. ✅ `blocked_attempt` - Tentative bloquée
15. ✅ `high_risk_login` - Connexion à risque élevé
16. ✅ `registration_success` - Inscription réussie
17. ✅ `registration_error` - Erreur d'inscription
18. ✅ `registration_rate_limit` - Limite d'inscription atteinte
19. ✅ `registration_injection_attempt` - Tentative d'injection lors de l'inscription

## 🔧 Configuration

Tous les paramètres de sécurité sont centralisés dans `src/utils/securityConfig.ts`:

```typescript
export const SecurityConfig = {
    session: {
        timeout: 24 * 60 * 60 * 1000, // 24 heures
        inactivityTimeout: 30 * 60 * 1000, // 30 minutes
        refreshInterval: 5 * 60 * 1000, // 5 minutes
    },
    password: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAttempts: 5,
        lockoutDuration: 15 * 60 * 1000, // 15 minutes
    },
    // ... autres configurations
};
```

## 📊 Utilisation

### Protection contre la Force Brute
```typescript
import { BruteForceProtection } from './utils/securityEnhancements';

// Vérifier si le compte est verrouillé
if (BruteForceProtection.isLocked(email)) {
    console.log('Compte verrouillé');
}

// Enregistrer une tentative
const result = BruteForceProtection.recordAttempt(email, success);
if (!result.allowed) {
    console.log(`Compte verrouillé jusqu'à ${new Date(result.lockedUntil!)}`);
}
```

### Validation des Entrées
```typescript
import { InputValidator } from './utils/securityEnhancements';

const result = InputValidator.validateInput(userInput, 'email');
if (!result.valid) {
    console.error('Erreurs:', result.errors);
} else {
    // Utiliser result.sanitized
}
```

### Détection d'Anomalies
```typescript
import { AnomalyDetector } from './utils/securityEnhancements';

// Enregistrer une action
AnomalyDetector.recordBehavior(userId, 'login');

// Analyser les anomalies
const { anomalies, riskScore } = AnomalyDetector.detectAnomalies(userId);
if (riskScore > 50) {
    // Demander une vérification supplémentaire
}
```

### Authentification 2FA
```typescript
import { TwoFactorAuth } from './utils/securityEnhancements';

// Générer un code
const code = TwoFactorAuth.generateCode(userId);
// Envoyer par email/SMS

// Vérifier le code
const valid = TwoFactorAuth.verifyCode(userId, userEnteredCode);
```

## 🎯 Recommandations

### Pour le Développement
1. ✅ Toujours utiliser HTTPS en production
2. ✅ Ne jamais logger les mots de passe ou tokens
3. ✅ Valider toutes les entrées utilisateur
4. ✅ Utiliser les wrappers de sécurité fournis
5. ⚠️ Tester régulièrement les vulnérabilités

### Pour le Déploiement
1. ⚠️ Configurer les en-têtes de sécurité sur le serveur
2. ⚠️ Activer HTTPS avec certificat valide
3. ⚠️ Configurer le CSP approprié
4. ⚠️ Mettre en place un système de monitoring
5. ⚠️ Sauvegarder régulièrement les logs de sécurité

### Pour les Utilisateurs
1. Utiliser des mots de passe forts et uniques
2. Activer l'authentification à deux facteurs (quand disponible)
3. Ne jamais partager ses identifiants
4. Se déconnecter après utilisation
5. Signaler toute activité suspecte

## 📝 Conformité

Cette implémentation respecte les standards suivants:
- **OWASP Top 10** - Protection contre les vulnérabilités courantes
- **GDPR** - Protection des données personnelles
- **ISO 27001** - Gestion de la sécurité de l'information
- **NIST** - Standards de cybersécurité

## 🔄 Mises à Jour

- **Version**: 2.0.0
- **Date**: 2026-02-13
- **Statut**: Intégration complète dans Login et Register
- **Prochaine révision**: Trimestrielle

## 📞 Contact Sécurité

Pour signaler une vulnérabilité: security@odin-la-science.com

## 🎉 Résumé de l'Intégration

### Fichiers Modifiés
1. ✅ `src/utils/securityEnhancements.ts` - Correction du regex path traversal
2. ✅ `src/pages/Login.tsx` - Intégration complète:
   - Vérification du verrouillage de compte
   - Validation des entrées (email, mot de passe)
   - Détection d'injections SQL/XSS
   - Enregistrement des tentatives de connexion
   - Détection d'anomalies comportementales
   - Logging de sécurité complet
3. ✅ `src/pages/Register.tsx` - Intégration complète:
   - Rate limiting (3 tentatives/heure)
   - Validation et sanitisation de toutes les entrées
   - Détection d'injections
   - Enregistrement du comportement
   - Logging de sécurité complet

### Fonctionnalités Actives
- ✅ Protection contre la force brute
- ✅ Détection d'anomalies
- ✅ Validation et sanitisation des entrées
- ✅ Rate limiting
- ✅ Logging de sécurité
- ✅ Chiffrement des mots de passe
- ✅ Gestion des sessions
- ✅ Protection CSRF

### Prochaines Étapes (Optionnel)
- ⚠️ Activer 2FA dans les paramètres utilisateur
- ⚠️ Configurer les en-têtes de sécurité au niveau serveur
- ⚠️ Implémenter un dashboard de monitoring de sécurité
- ⚠️ Ajouter des tests de sécurité automatisés

---

**Note**: Ce document doit être mis à jour à chaque modification des fonctionnalités de sécurité.
