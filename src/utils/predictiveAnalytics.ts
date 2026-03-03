// Système d'analyse prédictive pour anticiper les besoins utilisateur

interface UserAction {
  type: string;
  timestamp: number;
  page: string;
  metadata?: any;
}

interface Prediction {
  action: string;
  confidence: number;
  reason: string;
  suggestedPage?: string;
  suggestedTool?: string;
}

class PredictiveAnalytics {
  private actions: UserAction[] = [];
  private readonly STORAGE_KEY = 'ols_user_actions';
  private readonly MAX_ACTIONS = 100;

  constructor() {
    this.loadActions();
  }

  // Enregistrer une action utilisateur
  trackAction(type: string, page: string, metadata?: any) {
    const action: UserAction = {
      type,
      timestamp: Date.now(),
      page,
      metadata
    };

    this.actions.push(action);

    // Limiter le nombre d'actions stockées
    if (this.actions.length > this.MAX_ACTIONS) {
      this.actions = this.actions.slice(-this.MAX_ACTIONS);
    }

    this.saveActions();
  }

  // Prédire les prochaines actions
  predictNextActions(): Prediction[] {
    const predictions: Prediction[] = [];
    const recentActions = this.getRecentActions(10);

    // Analyse des patterns temporels
    const timePatterns = this.analyzeTimePatterns();
    if (timePatterns) {
      predictions.push(timePatterns);
    }

    // Analyse des séquences d'actions
    const sequencePattern = this.analyzeSequencePatterns(recentActions);
    if (sequencePattern) {
      predictions.push(sequencePattern);
    }

    // Analyse de fréquence
    const frequencyPattern = this.analyzeFrequencyPatterns();
    if (frequencyPattern) {
      predictions.push(frequencyPattern);
    }

    // Analyse contextuelle
    const contextPattern = this.analyzeContextualPatterns(recentActions);
    if (contextPattern) {
      predictions.push(contextPattern);
    }

    return predictions.sort((a, b) => b.confidence - a.confidence);
  }

  // Analyser les patterns temporels (heure de la journée)
  private analyzeTimePatterns(): Prediction | null {
    const hour = new Date().getHours();
    const dayActions = this.actions.filter(a => {
      const actionHour = new Date(a.timestamp).getHours();
      return Math.abs(actionHour - hour) <= 1;
    });

    if (dayActions.length < 3) return null;

    const pageCounts = this.countByPage(dayActions);
    const mostCommon = Object.entries(pageCounts).sort((a, b) => b[1] - a[1])[0];

    if (mostCommon && mostCommon[1] >= 2) {
      return {
        action: 'visit_page',
        confidence: Math.min(mostCommon[1] / dayActions.length, 0.9),
        reason: `Vous visitez souvent ${mostCommon[0]} à cette heure`,
        suggestedPage: mostCommon[0]
      };
    }

    return null;
  }

  // Analyser les séquences d'actions
  private analyzeSequencePatterns(recentActions: UserAction[]): Prediction | null {
    if (recentActions.length < 2) return null;

    const lastAction = recentActions[recentActions.length - 1];
    
    // Patterns courants
    const patterns: Record<string, { next: string, reason: string }> = {
      'LabNotebook': { next: 'ProtocolBuilder', reason: 'Après le cahier de labo, vous créez souvent un protocole' },
      'ProtocolBuilder': { next: 'ChemicalInventory', reason: 'Après un protocole, vous vérifiez souvent l\'inventaire' },
      'ChemicalInventory': { next: 'SafetyHub', reason: 'Après l\'inventaire, vous consultez souvent la sécurité' },
      'ExperimentPlanner': { next: 'EquipmentBooking', reason: 'Après la planification, vous réservez souvent l\'équipement' },
      'PCRDesigner': { next: 'GelSimulator', reason: 'Après le design PCR, vous simulez souvent le gel' },
      'ProteinFold': { next: 'BioAnalyzer', reason: 'Après le repliement, vous analysez souvent la structure' },
      'BacterialGrowthPredictor': { next: 'CultureCells', reason: 'Après la prédiction, vous gérez souvent les cultures' }
    };

    const pattern = patterns[lastAction.page];
    if (pattern) {
      return {
        action: 'visit_page',
        confidence: 0.75,
        reason: pattern.reason,
        suggestedPage: pattern.next
      };
    }

    return null;
  }

  // Analyser les patterns de fréquence
  private analyzeFrequencyPatterns(): Prediction | null {
    const last7Days = this.actions.filter(a => 
      Date.now() - a.timestamp < 7 * 24 * 60 * 60 * 1000
    );

    if (last7Days.length < 5) return null;

    const pageCounts = this.countByPage(last7Days);
    const mostUsed = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (mostUsed.length > 0 && mostUsed[0][1] >= 3) {
      return {
        action: 'frequent_tool',
        confidence: 0.7,
        reason: `Vous utilisez fréquemment ${mostUsed[0][0]}`,
        suggestedTool: mostUsed[0][0]
      };
    }

    return null;
  }

  // Analyser les patterns contextuels
  private analyzeContextualPatterns(recentActions: UserAction[]): Prediction | null {
    if (recentActions.length < 3) return null;

    const recentPages = recentActions.map(a => a.page);
    
    // Détection de workflow de biologie moléculaire
    const molBioPages = ['PCRDesigner', 'RestrictionMapper', 'CloningAssistant', 'GelSimulator'];
    const molBioCount = recentPages.filter(p => molBioPages.includes(p)).length;
    
    if (molBioCount >= 2) {
      const nextTool = molBioPages.find(p => !recentPages.includes(p));
      if (nextTool) {
        return {
          action: 'workflow_suggestion',
          confidence: 0.8,
          reason: 'Vous êtes dans un workflow de biologie moléculaire',
          suggestedTool: nextTool
        };
      }
    }

    // Détection de workflow de culture cellulaire
    const cellPages = ['CultureCells', 'BacterialGrowthPredictor', 'ColonyVision', 'PlateMapper'];
    const cellCount = recentPages.filter(p => cellPages.includes(p)).length;
    
    if (cellCount >= 2) {
      const nextTool = cellPages.find(p => !recentPages.includes(p));
      if (nextTool) {
        return {
          action: 'workflow_suggestion',
          confidence: 0.8,
          reason: 'Vous êtes dans un workflow de culture cellulaire',
          suggestedTool: nextTool
        };
      }
    }

    return null;
  }

  // Obtenir les actions récentes
  private getRecentActions(count: number): UserAction[] {
    return this.actions.slice(-count);
  }

  // Compter les actions par page
  private countByPage(actions: UserAction[]): Record<string, number> {
    return actions.reduce((acc, action) => {
      acc[action.page] = (acc[action.page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  // Sauvegarder les actions
  private saveActions() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.actions));
    } catch (e) {
      console.warn('Impossible de sauvegarder les actions:', e);
    }
  }

  // Charger les actions
  private loadActions() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.actions = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Impossible de charger les actions:', e);
      this.actions = [];
    }
  }

  // Obtenir les statistiques d'utilisation
  getUsageStats() {
    const last30Days = this.actions.filter(a => 
      Date.now() - a.timestamp < 30 * 24 * 60 * 60 * 1000
    );

    const pageCounts = this.countByPage(last30Days);
    const totalActions = last30Days.length;

    return {
      totalActions,
      mostUsedPages: Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([page, count]) => ({
          page,
          count,
          percentage: (count / totalActions * 100).toFixed(1)
        })),
      averageActionsPerDay: (totalActions / 30).toFixed(1)
    };
  }

  // Réinitialiser les données
  reset() {
    this.actions = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const predictiveAnalytics = new PredictiveAnalytics();
export { type Prediction, type UserAction };
