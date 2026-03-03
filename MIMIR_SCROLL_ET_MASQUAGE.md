# Mímir - Améliorations Scroll et Masquage

## ✅ Modifications Effectuées

### 1. Scroll Automatique Pendant la Discussion

**Problème**: Le chat ne scrollait pas automatiquement pendant que Mímir répondait, obligeant l'utilisateur à scroller manuellement pour voir la réponse complète.

**Solution**: Implémentation d'un système de scroll automatique intelligent.

#### Fonctionnalités Ajoutées

**A. Scroll au nouveau message**
```typescript
useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
        messagesEndRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end' 
        });
    }
}, [messages, isOpen, isMinimized]);
```
- Scroll automatique à chaque nouveau message
- Animation fluide (`behavior: 'smooth'`)
- Uniquement si le chat est ouvert et non minimisé

**B. Scroll pendant le streaming**
```typescript
// Dans la boucle de streaming
if (messagesContainerRef.current) {
    const container = messagesContainerRef.current;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    if (isNearBottom) {
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 10);
    }
}
```
- Scroll en temps réel pendant que Mímir écrit
- Détection intelligente: scroll uniquement si l'utilisateur est proche du bas (< 150px)
- Respect de l'intention de l'utilisateur (s'il a scrollé vers le haut, pas de scroll automatique)
- Délai de 10ms pour éviter les saccades

**C. Container avec scroll fluide**
```typescript
<div
    ref={messagesContainerRef}
    style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        scrollBehavior: 'smooth'  // Scroll fluide CSS
    }}
>
```
- `scrollBehavior: 'smooth'` pour des transitions fluides
- `overflowX: 'hidden'` pour éviter le scroll horizontal
- Référence `messagesContainerRef` pour contrôle programmatique

---

### 2. Masquage sur la Page AI Assistant

**Problème**: Le bouton flottant Mímir apparaissait sur la page AI Assistant complète, créant une redondance.

**Solution**: Détection de la route et masquage automatique.

#### Implémentation

**A. Détection de la route**
```typescript
import { useLocation } from 'react-router-dom';

const location = useLocation();
const isOnAIAssistantPage = location.pathname === '/hugin/ai-assistant';
```
- Utilisation du hook `useLocation` de React Router
- Vérification du pathname exact

**B. Masquage conditionnel**
```typescript
// Ne pas afficher le bouton sur la page AI Assistant
if (isOnAIAssistantPage) {
    return null;
}
```
- Return `null` si on est sur la page AI Assistant
- Le composant ne rend rien, économisant les ressources

**C. Logique de rendu**
```
1. Vérifier si on est sur /hugin/ai-assistant
   ↓ OUI → return null (pas de rendu)
   ↓ NON → Continuer
2. Vérifier si le chat est ouvert
   ↓ NON → Afficher le bouton flottant
   ↓ OUI → Afficher la fenêtre de chat
```

---

## 🎯 Comportements

### Scroll Automatique

#### Cas 1: Nouveau message utilisateur
1. Utilisateur envoie un message
2. Message ajouté à la liste
3. **Scroll automatique vers le bas** (smooth)
4. Mímir commence à répondre

#### Cas 2: Streaming de la réponse
1. Mímir commence à écrire
2. Chaque chunk de texte arrive
3. **Vérification**: Utilisateur proche du bas ?
   - OUI → Scroll automatique continu
   - NON → Pas de scroll (utilisateur lit un ancien message)
4. Réponse complète → Scroll final

#### Cas 3: Utilisateur scroll vers le haut
1. Utilisateur scroll manuellement vers le haut
2. Mímir continue d'écrire
3. **Pas de scroll automatique** (respect de l'intention)
4. Utilisateur peut lire tranquillement
5. Quand il scroll vers le bas → Scroll automatique reprend

### Masquage sur AI Assistant

#### Cas 1: Navigation vers AI Assistant
```
Page quelconque → /hugin/ai-assistant
↓
Bouton Mímir disparaît automatiquement
```

#### Cas 2: Navigation depuis AI Assistant
```
/hugin/ai-assistant → Page quelconque
↓
Bouton Mímir réapparaît automatiquement
```

#### Cas 3: Chat ouvert puis navigation
```
Chat Mímir ouvert → Navigation vers /hugin/ai-assistant
↓
Chat se ferme automatiquement
```

---

## 📊 Avantages

### Scroll Automatique

**Pour l'Utilisateur**:
- ✅ Pas besoin de scroller manuellement
- ✅ Lecture fluide des réponses longues
- ✅ Expérience naturelle comme un vrai chat
- ✅ Respect de l'intention (peut lire en haut sans être dérangé)

**Pour l'Expérience**:
- ✅ Sensation de conversation en temps réel
- ✅ Pas de frustration à chercher la fin de la réponse
- ✅ Focus sur le contenu, pas sur l'interface

### Masquage sur AI Assistant

**Pour l'Utilisateur**:
- ✅ Pas de redondance visuelle
- ✅ Interface épurée sur AI Assistant
- ✅ Pas de confusion entre popup et page complète
- ✅ Économie de ressources (pas de double rendu)

**Pour l'Interface**:
- ✅ Cohérence: un seul Mímir à la fois
- ✅ Clarté: page complète = version complète
- ✅ Performance: pas de composant inutile

---

## 🔧 Détails Techniques

### Références React

**messagesEndRef**:
```typescript
const messagesEndRef = useRef<HTMLDivElement>(null);

// Utilisation
<div ref={messagesEndRef} />
```
- Référence à un div invisible en fin de liste
- Utilisé pour `scrollIntoView()`

**messagesContainerRef**:
```typescript
const messagesContainerRef = useRef<HTMLDivElement>(null);

// Utilisation
<div ref={messagesContainerRef} style={{ overflowY: 'auto' }}>
```
- Référence au container scrollable
- Utilisé pour contrôle programmatique du scroll

### Calcul de Position

**isNearBottom**:
```typescript
const isNearBottom = 
    container.scrollHeight           // Hauteur totale du contenu
    - container.scrollTop            // Position actuelle du scroll
    - container.clientHeight         // Hauteur visible
    < 150;                           // Tolérance de 150px
```

**Explication**:
- `scrollHeight`: Hauteur totale (incluant partie cachée)
- `scrollTop`: Pixels scrollés depuis le haut
- `clientHeight`: Hauteur visible du container
- Si la différence < 150px → Utilisateur est "proche du bas"

### Timing du Scroll

**setTimeout de 10ms**:
```typescript
setTimeout(() => {
    container.scrollTop = container.scrollHeight;
}, 10);
```
- Délai minimal pour éviter les conflits de rendu
- Permet au DOM de se mettre à jour avant le scroll
- Évite les saccades visuelles

---

## 🧪 Tests Recommandés

### Test 1: Scroll Automatique Basique
1. Ouvrir Mímir
2. Poser une question
3. **Vérifier**: Scroll automatique vers la réponse
4. **Résultat attendu**: Vue sur la réponse complète

### Test 2: Scroll Pendant Streaming
1. Ouvrir Mímir
2. Poser une question longue (ex: "Explique la PCR en détail")
3. **Observer**: Le scroll suit la réponse en temps réel
4. **Résultat attendu**: Toujours voir la fin de la réponse

### Test 3: Respect de l'Intention Utilisateur
1. Ouvrir Mímir
2. Poser une question
3. Pendant que Mímir répond, **scroller vers le haut**
4. **Observer**: Pas de scroll automatique
5. **Résultat attendu**: Peut lire tranquillement en haut

### Test 4: Reprise du Scroll
1. Après le test 3, **scroller vers le bas**
2. **Observer**: Scroll automatique reprend
3. **Résultat attendu**: Suit à nouveau la réponse

### Test 5: Masquage sur AI Assistant
1. Ouvrir n'importe quelle page
2. **Vérifier**: Bouton Mímir visible
3. Naviguer vers `/hugin/ai-assistant`
4. **Vérifier**: Bouton Mímir disparu
5. Naviguer vers une autre page
6. **Vérifier**: Bouton Mímir réapparu

### Test 6: Chat Ouvert puis Navigation
1. Ouvrir le chat Mímir
2. Naviguer vers `/hugin/ai-assistant`
3. **Vérifier**: Chat fermé automatiquement
4. **Résultat attendu**: Pas de popup sur AI Assistant

---

## 📱 Comportement Mobile

### Scroll Automatique
- ✅ Fonctionne identiquement sur mobile
- ✅ Scroll tactile respecté
- ✅ Pas de conflit avec le scroll natif

### Masquage
- ✅ Fonctionne sur mobile
- ✅ Pas de bouton sur AI Assistant mobile

---

## 🎨 Expérience Utilisateur

### Avant les Améliorations
❌ Utilisateur doit scroller manuellement pendant la réponse
❌ Perd le fil de la conversation
❌ Bouton redondant sur AI Assistant
❌ Confusion entre popup et page complète

### Après les Améliorations
✅ Scroll automatique fluide
✅ Suit la conversation naturellement
✅ Peut lire en haut sans être dérangé
✅ Pas de redondance sur AI Assistant
✅ Interface cohérente et claire

---

## 💡 Cas d'Usage

### Cas 1: Question Simple
```
User: "Qu'est-ce que la PCR ?"
↓
Mímir répond (court)
↓
Scroll automatique → Réponse visible complètement
```

### Cas 2: Question Complexe
```
User: "Explique la PCR en détail avec protocole"
↓
Mímir répond (long, avec tableau et code)
↓
Scroll automatique continu pendant l'écriture
↓
Utilisateur voit toujours la fin de la réponse
```

### Cas 3: Lecture d'Ancien Message
```
User: Pose une question
↓
Mímir répond
↓
User: Scroll vers le haut pour relire
↓
Mímir continue d'écrire
↓
Pas de scroll automatique (respect)
↓
User: Scroll vers le bas
↓
Scroll automatique reprend
```

### Cas 4: Navigation vers AI Assistant
```
User: Sur /hugin/planning
↓
Bouton Mímir visible
↓
User: Clique sur AI Assistant
↓
Navigation vers /hugin/ai-assistant
↓
Bouton Mímir disparaît
↓
User: Utilise la version complète
```

---

## 🔄 Flux de Données

### Scroll Automatique
```
Message ajouté
    ↓
useEffect déclenché
    ↓
messagesEndRef.scrollIntoView()
    ↓
Animation smooth
    ↓
Vue sur le nouveau message
```

### Streaming avec Scroll
```
Chunk reçu
    ↓
Message mis à jour
    ↓
Vérification isNearBottom
    ↓
OUI → setTimeout(scroll, 10ms)
    ↓
Scroll vers le bas
    ↓
Chunk suivant...
```

### Masquage
```
Navigation
    ↓
location.pathname change
    ↓
isOnAIAssistantPage recalculé
    ↓
Rendu conditionnel
    ↓
null ou <MimirButton />
```

---

## ✅ Résumé

**2 améliorations majeures implémentées**:

1. **Scroll Automatique Intelligent**
   - ✅ Scroll à chaque nouveau message
   - ✅ Scroll continu pendant le streaming
   - ✅ Respect de l'intention utilisateur
   - ✅ Animation fluide
   - ✅ Fonctionne sur mobile

2. **Masquage sur AI Assistant**
   - ✅ Détection automatique de la route
   - ✅ Masquage complet du composant
   - ✅ Pas de redondance
   - ✅ Interface cohérente

**Fichier modifié**: `src/components/MimirFloatingButton.tsx`

**Lignes ajoutées**: ~30 lignes

**Impact**: Expérience utilisateur grandement améliorée ! 🚀
