# Correction des Formats de Date - 13/02/2026

## Problème Identifié

Les erreurs Supabase 400 étaient causées par des formats de date incompatibles:

### Erreur 1: Planning Events
```
invalid input syntax for type timestamp: "2026-undefined-2026-02-13T09:00:00"
```

### Erreur 2: Messages
```
date/time field value out of range: "13/02/2026 13:37"
```

## Solution Appliquée

### Planning (`src/utils/persistence.ts`)

La fonction `transformPlanningForSupabase` a été améliorée pour:
- Détecter automatiquement le format de date (ISO ou français)
- Convertir les dates françaises (DD/MM/YYYY) en format ISO (YYYY-MM-DD)
- Gérer correctement les heures avec padding des zéros
- Créer des timestamps ISO valides: `YYYY-MM-DDTHH:MM:SS`

```typescript
// Si la date est au format français (DD/MM/YYYY), la convertir
if (item.date.includes('/')) {
    const [day, month, year] = item.date.split('/');
    dateISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
```

### Messages (`src/pages/hugin/Planning.tsx`)

Les messages de rappel utilisent maintenant `toISOString()`:
```typescript
date: new Date().toISOString(), // Format ISO pour Supabase
```

## Déploiement

✅ Code poussé sur GitHub: commit `a231dfd`
✅ Vercel redéploie automatiquement (2-3 minutes)

## Tests à Effectuer

1. **Planning**: Créer un événement et rafraîchir la page
   - L'événement doit persister
   - Vérifier dans Supabase Table Editor > `planning_events`

2. **Messages**: Envoyer un message
   - Le destinataire doit le recevoir
   - Vérifier dans Supabase Table Editor > `messages`

3. **Synchronisation**: Tester sur un second appareil
   - Se connecter avec le même compte
   - Vérifier que les données apparaissent

## Prochaines Étapes

Une fois le déploiement Vercel terminé:
1. Tester la création d'événements Planning
2. Vérifier la persistance après refresh
3. Tester l'envoi de messages
4. Confirmer la synchronisation cross-device
