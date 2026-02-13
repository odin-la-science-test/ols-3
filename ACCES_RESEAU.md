# 🌐 Accès Réseau au Serveur de Développement

## ✅ Le Serveur est Déjà Accessible!

Vite expose automatiquement le serveur sur le réseau local:

```
➜  Local:   http://localhost:5175/
➜  Network: http://172.26.178.103:5175/
```

## 📱 Accéder depuis un Téléphone/Tablette

### Étape 1: Vérifier le Réseau
- Ton PC et ton appareil mobile doivent être sur le **même réseau WiFi**
- Pas de VPN actif qui pourrait bloquer

### Étape 2: Trouver l'Adresse IP
L'adresse réseau est affichée au démarrage du serveur:
```
➜  Network: http://172.26.178.103:5175/
```

### Étape 3: Accéder depuis le Mobile
1. Ouvre le navigateur sur ton téléphone
2. Entre l'URL: `http://172.26.178.103:5175/`
3. Le site devrait s'afficher en version mobile automatiquement!

## 🔥 Configurer le Pare-feu Windows

Si l'accès est bloqué, autorise Node.js dans le pare-feu:

### Méthode 1: Interface Graphique

1. Ouvre **Panneau de configuration** > **Système et sécurité** > **Pare-feu Windows Defender**
2. Clique sur **Autoriser une application via le pare-feu**
3. Clique sur **Modifier les paramètres**
4. Cherche **Node.js** dans la liste
5. Coche les cases **Privé** et **Public**
6. Clique sur **OK**

### Méthode 2: Ligne de Commande (Admin)

Ouvre PowerShell en tant qu'administrateur et exécute:

```powershell
# Autoriser Node.js sur le réseau privé
New-NetFirewallRule -DisplayName "Node.js Server" -Direction Inbound -Program "C:\Program Files\nodejs\node.exe" -Action Allow -Profile Private

# Autoriser le port 5175 spécifiquement
New-NetFirewallRule -DisplayName "Vite Dev Server" -Direction Inbound -LocalPort 5175 -Protocol TCP -Action Allow -Profile Private
```

## 🔍 Trouver ton Adresse IP Manuellement

Si l'adresse n'est pas affichée, trouve-la avec:

```powershell
ipconfig
```

Cherche la ligne **Adresse IPv4** sous ta connexion WiFi:
```
Carte réseau sans fil Wi-Fi :
   Adresse IPv4. . . . . . . . . . . . . .: 192.168.1.XXX
```

Utilise cette adresse: `http://192.168.1.XXX:5175/`

## 📊 Tester la Connexion

### Depuis ton PC:
```powershell
# Vérifie que le serveur écoute
netstat -an | findstr "5175"
```

Tu devrais voir:
```
TCP    0.0.0.0:5175           0.0.0.0:0              LISTENING
```

### Depuis un Autre Appareil:
```bash
# Sur Linux/Mac
ping 172.26.178.103

# Sur Windows (depuis un autre PC)
ping 172.26.178.103
```

## 🚀 Configuration Vite (Déjà Active)

Le fichier `vite.config.ts` devrait contenir:

```typescript
export default defineConfig({
  server: {
    host: true,  // Expose sur le réseau
    port: 5173,
    strictPort: false  // Essaie d'autres ports si occupé
  }
})
```

C'est déjà configuré par défaut dans Vite!

## 📱 Tester la Version Mobile

1. Accède depuis ton téléphone: `http://172.26.178.103:5175/`
2. Connecte-toi avec un compte test
3. La version mobile devrait s'afficher automatiquement
4. Teste la navigation et les modules

## 🔒 Sécurité

### ⚠️ Important:
- Le serveur de dev n'est **PAS sécurisé** pour la production
- N'expose **JAMAIS** ce serveur sur Internet
- Utilise uniquement sur ton réseau local privé
- Pour la production, utilise `npm run build` et un vrai serveur

### Réseau Sécurisé:
- Utilise un réseau WiFi privé (pas public)
- Active le pare-feu Windows
- Ne partage pas l'adresse IP publiquement

## 🐛 Dépannage

### Problème: "Site inaccessible"

**Solution 1: Vérifier le pare-feu**
```powershell
# Désactive temporairement pour tester (Admin)
netsh advfirewall set allprofiles state off

# Réactive après le test
netsh advfirewall set allprofiles state on
```

**Solution 2: Vérifier le réseau**
- Même réseau WiFi?
- VPN désactivé?
- Antivirus qui bloque?

**Solution 3: Redémarrer le serveur**
```bash
# Arrête le serveur (Ctrl+C)
# Relance
npm run dev
```

### Problème: "Connexion refusée"

**Vérifier que le serveur tourne:**
```powershell
netstat -an | findstr "5175"
```

**Vérifier l'adresse IP:**
```powershell
ipconfig
```

### Problème: Version desktop sur mobile

**Forcer le refresh:**
- Ctrl+Shift+R (ou Cmd+Shift+R sur Mac)
- Vider le cache du navigateur mobile

**Vérifier la détection:**
- Ouvre les DevTools sur PC
- Toggle device toolbar
- Vérifie que `isMobile` est `true`

## 📋 Checklist Accès Réseau

- [ ] Serveur Vite lancé (`npm run dev`)
- [ ] Adresse réseau affichée dans la console
- [ ] PC et mobile sur le même WiFi
- [ ] Pare-feu autorise Node.js
- [ ] Pas de VPN actif
- [ ] URL correcte: `http://IP:5175/`
- [ ] Navigateur mobile à jour

## 🎯 Adresses Utiles

| Appareil | URL |
|----------|-----|
| PC Local | http://localhost:5175/ |
| Réseau Local | http://172.26.178.103:5175/ |
| Autre PC (même réseau) | http://172.26.178.103:5175/ |
| Téléphone (même réseau) | http://172.26.178.103:5175/ |
| Tablette (même réseau) | http://172.26.178.103:5175/ |

## 💡 Astuces

### QR Code pour Accès Rapide
Génère un QR code avec l'URL pour scanner depuis ton téléphone:
- Site: https://www.qr-code-generator.com/
- Entre: `http://172.26.178.103:5175/`
- Scanne avec ton téléphone

### Bookmark Mobile
Ajoute l'URL à l'écran d'accueil de ton téléphone:
1. Ouvre l'URL dans le navigateur mobile
2. Menu > "Ajouter à l'écran d'accueil"
3. Accès rapide comme une app!

### Tunnel Public (Avancé)
Pour partager avec quelqu'un hors de ton réseau:
```bash
npm install -g localtunnel
lt --port 5175
```
⚠️ Utilise avec précaution!

---

**Note**: L'adresse IP `172.26.178.103` est spécifique à ton réseau. Elle peut changer si tu redémarres ton routeur ou changes de réseau.
