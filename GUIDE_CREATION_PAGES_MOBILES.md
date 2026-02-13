# Guide de Création des Pages Mobiles

## ✅ Pages Mobiles Créées (9/70)

### Pages Principales (4)
1. ✅ LandingPage
2. ✅ Home
3. ✅ Discipline
4. ✅ EntityDetail

### Modules Hugin (5)
1. ✅ Messaging
2. ✅ Planning
3. ✅ BioAnalyzer
4. ✅ Inventory
5. ✅ Documents

## 📋 Template Standard pour Pages Mobiles

### Structure de Base

```tsx
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../components/ToastContext';
import { fetchModuleData, saveModuleItem, deleteModuleItem } from '../../../utils/persistence';

const MobileModuleName = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const result = await fetchModuleData('module_name');
        if (result) setData(result);
    };

    return (
        <div className="app-viewport">
            {/* Header Fixe */}
            <div style={{
                position: 'sticky',
                top: 0,
                background: 'var(--bg-primary)',
                borderBottom: '1px solid var(--border-color)',
                zIndex: 100
            }}>
                <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => navigate('/hugin')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-primary)',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex'
                        }}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '1.25rem', margin: 0 }}>Titre Module</h1>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                            {data.length} éléments
                        </p>
                    </div>
                    <button
                        onClick={() => {/* Action */}}
                        style={{
                            background: 'var(--accent-hugin)',
                            border: 'none',
                            color: 'white',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            minWidth: '44px',
                            minHeight: '44px',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Plus size={20} />
                    </button>
                </div>

                {/* Barre de Recherche */}
                <div style={{ padding: '0 1rem 1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search
                            size={18}
                            style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-secondary)'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 3rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Contenu Scrollable */}
            <div className="app-scrollbox" style={{ padding: '1rem' }}>
                {data.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                        <p>Aucune donnée</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {data.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '1rem'
                                }}
                            >
                                {/* Contenu de la carte */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileModuleName;
```

## 🎨 Composants Réutilisables

### Carte Standard
```tsx
<div style={{
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1rem'
}}>
    {/* Contenu */}
</div>
```

### Bouton Touch-Friendly
```tsx
<button style={{
    minWidth: '44px',
    minHeight: '44px',
    padding: '0.75rem',
    borderRadius: '12px',
    cursor: 'pointer'
}}>
    {/* Icône ou texte */}
</button>
```

### Bottom Sheet (Formulaire)
```tsx
<div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'flex-end'
}}>
    <div style={{
        background: 'var(--bg-primary)',
        borderRadius: '20px 20px 0 0',
        padding: '1.5rem',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto'
    }}>
        {/* Formulaire */}
    </div>
</div>
```

### Catégories Horizontales
```tsx
<div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
    {categories.map(cat => (
        <button
            key={cat}
            style={{
                padding: '0.5rem 1rem',
                background: selected === cat ? 'var(--accent-hugin)' : 'var(--bg-secondary)',
                border: 'none',
                borderRadius: '20px',
                color: selected === cat ? 'white' : 'var(--text-primary)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                minHeight: '36px'
            }}
        >
            {cat}
        </button>
    ))}
</div>
```

## 📱 Règles de Design Mobile

### Touch Targets
- Minimum 44x44px pour tous les éléments interactifs
- Espacement de 8px minimum entre les boutons
- Padding généreux (1rem minimum)

### Typography
- Titres: 1.25-1.5rem
- Corps: 1rem
- Secondaire: 0.85-0.9rem
- Labels: 0.75-0.8rem

### Spacing
- Padding conteneur: 1rem
- Gap entre cartes: 0.75rem
- Padding carte: 1rem
- Margin sections: 1.5rem

### Colors
- Primary: var(--accent-hugin) #3b82f6
- Success: #10b981
- Error: #ef4444
- Warning: #f59e0b
- Secondary: var(--text-secondary)

### Border Radius
- Cartes: 12px
- Boutons: 8-12px
- Pills/Tags: 20px
- Inputs: 8-12px

## 🔄 Intégration dans App.tsx

Pour chaque page mobile créée, ajouter dans App.tsx:

```tsx
// Import
const MobileModuleName = lazy(() => import('./pages/mobile/hugin/ModuleName'));

// Route
<Route path="/hugin/module" element={
  <ProtectedRoute module="hugin_core">
    <ResponsiveRoute 
      desktopComponent={ModuleName} 
      mobileComponent={MobileModuleName} 
    />
  </ProtectedRoute>
} />
```

## 📋 Checklist Création Page Mobile

- [ ] Créer le fichier dans `src/pages/mobile/` ou `src/pages/mobile/hugin/`
- [ ] Importer les hooks nécessaires (useState, useEffect, useNavigate, useToast)
- [ ] Importer les icônes Lucide
- [ ] Importer les utils (fetchModuleData, saveModuleItem, deleteModuleItem)
- [ ] Créer la structure app-viewport + header + app-scrollbox
- [ ] Ajouter le bouton retour avec ArrowLeft
- [ ] Ajouter la barre de recherche si nécessaire
- [ ] Créer les cartes avec border-radius 12px
- [ ] Vérifier tous les touch targets (44x44px minimum)
- [ ] Tester le scroll
- [ ] Ajouter dans App.tsx avec lazy loading
- [ ] Tester sur mobile réel ou émulateur

## 🚀 Ordre de Priorité

### Phase 1: Core (Urgent)
1. CultureTracking
2. ScientificResearch
3. ITArchive
4. Meetings
5. LabNotebook

### Phase 2: Lab Management
1. StockManager
2. CryoKeeper
3. EquipFlow
4. GrantBudget
5. SOPLibrary
6. ProjectMind
7. SafetyHub

### Phase 3: Analysis Tools
1. ImageAnalyzer
2. StatisticsLab
3. BioToolBox
4. SequenceLens
5. FlowAnalyzer
6. GelPro

### Phase 4: Autres
1. Account
2. Settings
3. Documentation
4. Features
5. Munin (PropertyDetail, CompareEntities)

## 💡 Astuces

### Réutilisation de Code
- Copier une page similaire existante
- Adapter les types et les données
- Modifier les icônes et les couleurs

### Performance
- Utiliser lazy loading pour toutes les pages
- Limiter les re-renders avec useMemo/useCallback si nécessaire
- Optimiser les listes longues avec virtualisation

### UX Mobile
- Toujours un bouton retour visible
- Feedback visuel sur les actions (toast)
- Loading states pour les opérations async
- Gestion des erreurs avec messages clairs

## 📊 Progression Actuelle

- **Total**: 70 pages
- **Créées**: 9 (13%)
- **Prioritaires restantes**: ~20
- **Temps estimé restant**: 6-8 heures

## 🎯 Objectif

Avoir toutes les pages prioritaires (Phase 1 + Phase 2) en version mobile d'ici la fin de la semaine.
