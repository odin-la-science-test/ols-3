export const specialAdmins = ['ethan@OLS.com', 'bastien@OLS.com', 'issam@OLS.com', 'admin'];

export interface UserSubscription {
    status: string;
    planType: string;
    modules: string | string[];
}

export interface UserProfile {
    username?: string;
    organizationId?: string;
    subscription?: UserSubscription;
    hiddenTools?: string[];
}

export const getAccessData = (currentUser: string | null) => {
    if (!currentUser) return { profile: null, sub: null, hiddenTools: [] };

    const profileStr = localStorage.getItem(`user_profile_${currentUser}`);
    if (!profileStr) return { profile: null, sub: null, hiddenTools: [] };

    const profile: UserProfile = JSON.parse(profileStr);
    return {
        profile,
        sub: profile.subscription,
        hiddenTools: profile.hiddenTools || []
    };
};

export const checkHasAccess = (moduleId: string, currentUser: string | null, sub: UserSubscription | undefined, hiddenTools: string[]) => {
    // Special Admins have access to everything
    if (currentUser && specialAdmins.includes(currentUser)) return true;

    // 'any' modules are always accessible
    if (moduleId === 'any') return true;

    // Hide if user explicitly hid it in settings
    if (hiddenTools.includes(moduleId)) return false;

    if (!sub) return false;

    // Full pack has access to everything
    if (sub.planType === 'full' || sub.modules === 'all') return true;

    // Category mapping
    const coreModules = ['messaging', 'planning', 'projects', 'inventory', 'tableur', 'meetings', 'it_archive'];
    const labModules = ['culture', 'research', 'mimir', 'bibliography', 'notebook', 'stock', 'cryo', 'equip', 'budget', 'sop', 'safety'];
    const analysisModules = ['biotools', 'sequence', 'colony', 'flow', 'spectrum', 'gel', 'phylo', 'molecules', 'kinetics', 'plates', 'mixer', 'primers', 'cells', 'colony'];

    const userModules = Array.isArray(sub.modules) ? sub.modules : [];

    if (coreModules.includes(moduleId)) return userModules.includes('hugin_core');
    if (labModules.includes(moduleId)) return userModules.includes('hugin_lab');
    if (analysisModules.includes(moduleId)) return userModules.includes('hugin_analysis');

    // Default for advanced modules or unknown ones
    return userModules.includes('hugin_lab');
};
