/**
 * Enhanced Security Features
 * Additional security layers for the application
 */

import { SecurityLogger } from './securityConfig';
import { generateSecureToken } from './encryption';

/**
 * Brute Force Protection
 */
export class BruteForceProtection {
    private static attempts: Map<string, { count: number; firstAttempt: number; lockedUntil?: number }> = new Map();
    private static readonly MAX_ATTEMPTS = 5;
    private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
    private static readonly ATTEMPT_WINDOW = 5 * 60 * 1000; // 5 minutes

    static recordAttempt(identifier: string, success: boolean): { allowed: boolean; remainingAttempts?: number; lockedUntil?: number } {
        const now = Date.now();
        const record = this.attempts.get(identifier);

        // Check if currently locked
        if (record?.lockedUntil && now < record.lockedUntil) {
            SecurityLogger.log('blocked_attempt', identifier, { reason: 'account_locked' });
            return { 
                allowed: false, 
                lockedUntil: record.lockedUntil 
            };
        }

        if (success) {
            // Clear attempts on successful login
            this.attempts.delete(identifier);
            SecurityLogger.log('successful_login', identifier);
            return { allowed: true };
        }

        // Failed attempt
        if (!record || now - record.firstAttempt > this.ATTEMPT_WINDOW) {
            // Start new attempt window
            this.attempts.set(identifier, { count: 1, firstAttempt: now });
            SecurityLogger.log('failed_login', identifier, { attempts: 1 });
            return { allowed: true, remainingAttempts: this.MAX_ATTEMPTS - 1 };
        }

        // Increment attempts
        record.count++;
        
        if (record.count >= this.MAX_ATTEMPTS) {
            // Lock the account
            record.lockedUntil = now + this.LOCKOUT_DURATION;
            SecurityLogger.log('account_locked', identifier, { duration: this.LOCKOUT_DURATION });
            return { 
                allowed: false, 
                lockedUntil: record.lockedUntil 
            };
        }

        SecurityLogger.log('failed_login', identifier, { attempts: record.count });
        return { 
            allowed: true, 
            remainingAttempts: this.MAX_ATTEMPTS - record.count 
        };
    }

    static isLocked(identifier: string): boolean {
        const record = this.attempts.get(identifier);
        if (!record?.lockedUntil) return false;
        
        const now = Date.now();
        if (now >= record.lockedUntil) {
            this.attempts.delete(identifier);
            return false;
        }
        
        return true;
    }

    static unlock(identifier: string): void {
        this.attempts.delete(identifier);
        SecurityLogger.log('account_unlocked', identifier);
    }
}

/**
 * Anomaly Detection
 */
export class AnomalyDetector {
    private static userBehavior: Map<string, {
        loginTimes: number[];
        locations: string[];
        devices: string[];
        actions: string[];
    }> = new Map();

    static recordBehavior(userId: string, action: string): void {
        const behavior = this.userBehavior.get(userId) || {
            loginTimes: [],
            locations: [],
            devices: [],
            actions: []
        };

        behavior.actions.push(action);
        behavior.loginTimes.push(Date.now());

        // Keep only last 100 actions
        if (behavior.actions.length > 100) {
            behavior.actions = behavior.actions.slice(-100);
            behavior.loginTimes = behavior.loginTimes.slice(-100);
        }

        this.userBehavior.set(userId, behavior);
    }

    static detectAnomalies(userId: string): { anomalies: string[]; riskScore: number } {
        const behavior = this.userBehavior.get(userId);
        if (!behavior) return { anomalies: [], riskScore: 0 };

        const anomalies: string[] = [];
        let riskScore = 0;

        // Check for unusual login times
        const now = new Date();
        const hour = now.getHours();
        if (hour >= 2 && hour <= 5) {
            anomalies.push('Connexion à une heure inhabituelle');
            riskScore += 20;
        }

        // Check for rapid successive actions
        const recentActions = behavior.loginTimes.slice(-10);
        if (recentActions.length >= 10) {
            const timeSpan = recentActions[recentActions.length - 1] - recentActions[0];
            if (timeSpan < 10000) { // 10 seconds
                anomalies.push('Actions trop rapides (possible bot)');
                riskScore += 40;
            }
        }

        // Check for unusual action patterns
        const actionCounts = behavior.actions.reduce((acc, action) => {
            acc[action] = (acc[action] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const maxCount = Math.max(...Object.values(actionCounts));
        if (maxCount > 50) {
            anomalies.push('Action répétée de manière suspecte');
            riskScore += 30;
        }

        if (anomalies.length > 0) {
            SecurityLogger.log('anomaly_detected', userId, { anomalies, riskScore });
        }

        return { anomalies, riskScore };
    }
}

/**
 * Input Validation & Sanitization
 */
export class InputValidator {
    // SQL Injection patterns
    private static readonly SQL_PATTERNS = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
        /(--|;|\/\*|\*\/|xp_|sp_)/gi,
        /(\bOR\b.*=.*|1=1|'=')/gi
    ];

    // XSS patterns
    private static readonly XSS_PATTERNS = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe/gi,
        /<object/gi,
        /<embed/gi
    ];

    // Path traversal patterns
    private static readonly PATH_TRAVERSAL_PATTERNS = [
        /\.\./g,
        /\.\.[\/\\]/g,
        /%2e%2e/gi
    ];

    static validateInput(input: string, type: 'text' | 'email' | 'url' | 'number' | 'sql' | 'path'): { valid: boolean; sanitized: string; errors: string[] } {
        const errors: string[] = [];
        let sanitized = input.trim();

        // Check for SQL injection
        if (type === 'sql' || type === 'text') {
            for (const pattern of this.SQL_PATTERNS) {
                if (pattern.test(sanitized)) {
                    errors.push('Tentative d\'injection SQL détectée');
                    SecurityLogger.log('sql_injection_attempt', undefined, { input: sanitized.substring(0, 100) });
                    break;
                }
            }
        }

        // Check for XSS
        for (const pattern of this.XSS_PATTERNS) {
            if (pattern.test(sanitized)) {
                errors.push('Tentative de XSS détectée');
                SecurityLogger.log('xss_attempt', undefined, { input: sanitized.substring(0, 100) });
                sanitized = sanitized.replace(pattern, '');
            }
        }

        // Check for path traversal
        if (type === 'path') {
            for (const pattern of this.PATH_TRAVERSAL_PATTERNS) {
                if (pattern.test(sanitized)) {
                    errors.push('Tentative de path traversal détectée');
                    SecurityLogger.log('path_traversal_attempt', undefined, { input: sanitized });
                    sanitized = sanitized.replace(pattern, '');
                }
            }
        }

        // Type-specific validation
        switch (type) {
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized)) {
                    errors.push('Format d\'email invalide');
                }
                break;
            case 'url':
                try {
                    new URL(sanitized);
                } catch {
                    errors.push('Format d\'URL invalide');
                }
                break;
            case 'number':
                if (!/^\d+(\.\d+)?$/.test(sanitized)) {
                    errors.push('Format de nombre invalide');
                }
                break;
        }

        // HTML encode for safety
        const div = document.createElement('div');
        div.textContent = sanitized;
        sanitized = div.innerHTML;

        return {
            valid: errors.length === 0,
            sanitized,
            errors
        };
    }

    static sanitizeObject(obj: any): any {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        const sanitized: any = Array.isArray(obj) ? [] : {};

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                
                if (typeof value === 'string') {
                    const result = this.validateInput(value, 'text');
                    sanitized[key] = result.sanitized;
                } else if (typeof value === 'object') {
                    sanitized[key] = this.sanitizeObject(value);
                } else {
                    sanitized[key] = value;
                }
            }
        }

        return sanitized;
    }
}

/**
 * Two-Factor Authentication (2FA)
 */
export class TwoFactorAuth {
    private static codes: Map<string, { code: string; expiresAt: number }> = new Map();
    private static readonly CODE_EXPIRY = 5 * 60 * 1000; // 5 minutes

    static generateCode(userId: string): string {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + this.CODE_EXPIRY;
        
        this.codes.set(userId, { code, expiresAt });
        SecurityLogger.log('2fa_code_generated', userId);
        
        return code;
    }

    static verifyCode(userId: string, code: string): boolean {
        const stored = this.codes.get(userId);
        
        if (!stored) {
            SecurityLogger.log('2fa_verification_failed', userId, { reason: 'no_code' });
            return false;
        }

        if (Date.now() > stored.expiresAt) {
            this.codes.delete(userId);
            SecurityLogger.log('2fa_verification_failed', userId, { reason: 'expired' });
            return false;
        }

        if (stored.code !== code) {
            SecurityLogger.log('2fa_verification_failed', userId, { reason: 'invalid_code' });
            return false;
        }

        this.codes.delete(userId);
        SecurityLogger.log('2fa_verification_success', userId);
        return true;
    }
}

/**
 * Security Headers Validator
 */
export class SecurityHeadersValidator {
    static validateHeaders(headers: Headers): { secure: boolean; issues: string[] } {
        const issues: string[] = [];

        const requiredHeaders = {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': ['DENY', 'SAMEORIGIN'],
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': /max-age=\d+/
        };

        for (const [header, expected] of Object.entries(requiredHeaders)) {
            const value = headers.get(header);
            
            if (!value) {
                issues.push(`En-tête manquant: ${header}`);
                continue;
            }

            if (Array.isArray(expected)) {
                if (!expected.includes(value)) {
                    issues.push(`Valeur incorrecte pour ${header}: ${value}`);
                }
            } else if (expected instanceof RegExp) {
                if (!expected.test(value)) {
                    issues.push(`Format incorrect pour ${header}: ${value}`);
                }
            } else if (value !== expected) {
                issues.push(`Valeur incorrecte pour ${header}: ${value}`);
            }
        }

        return {
            secure: issues.length === 0,
            issues
        };
    }
}

/**
 * Secure Random Generator
 */
export class SecureRandom {
    static generatePassword(length: number = 16): string {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        const all = uppercase + lowercase + numbers + special;

        let password = '';
        
        // Ensure at least one of each type
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += special[Math.floor(Math.random() * special.length)];

        // Fill the rest
        for (let i = password.length; i < length; i++) {
            password += all[Math.floor(Math.random() * all.length)];
        }

        // Shuffle
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    static generateToken(length: number = 32): string {
        return generateSecureToken(length);
    }
}

export default {
    BruteForceProtection,
    AnomalyDetector,
    InputValidator,
    TwoFactorAuth,
    SecurityHeadersValidator,
    SecureRandom
};
