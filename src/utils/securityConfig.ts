/**
 * Security Configuration
 * Centralized security settings and policies
 */

export const SecurityConfig = {
    // Session configuration
    session: {
        timeout: 24 * 60 * 60 * 1000, // 24 hours
        inactivityTimeout: 30 * 60 * 1000, // 30 minutes
        refreshInterval: 5 * 60 * 1000, // 5 minutes
    },

    // Password policy
    password: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAttempts: 5,
        lockoutDuration: 15 * 60 * 1000, // 15 minutes
    },

    // Rate limiting
    rateLimit: {
        login: {
            maxAttempts: 5,
            windowMs: 60 * 1000, // 1 minute
        },
        api: {
            maxAttempts: 100,
            windowMs: 60 * 1000, // 1 minute
        },
        registration: {
            maxAttempts: 3,
            windowMs: 60 * 60 * 1000, // 1 hour
        },
    },

    // Encryption
    encryption: {
        algorithm: 'AES-GCM',
        keyLength: 256,
        iterations: 100000,
        saltLength: 16,
        ivLength: 12,
    },

    // CORS configuration
    cors: {
        allowedOrigins: [
            'http://localhost:5173',
            'http://localhost:3001',
            'https://odin-la-science.infinityfree.me',
        ],
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-CSRF-Token',
            'X-Requested-With',
        ],
        credentials: true,
    },

    // Content Security Policy
    csp: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", 'https://api.odin-la-science.com'],
            frameAncestors: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
        },
    },

    // Security headers
    headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    },

    // Data classification
    sensitiveFields: [
        'password',
        'token',
        'apiKey',
        'secret',
        'creditCard',
        'ssn',
        'bankAccount',
    ],

    // Audit logging
    audit: {
        enabled: true,
        events: [
            'login',
            'logout',
            'failed_login',
            'password_change',
            'data_access',
            'data_modification',
            'permission_change',
        ],
    },

    // File upload restrictions
    upload: {
        maxFileSize: 10 * 1024 * 1024, // 10 MB
        allowedTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/pdf',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
        scanForMalware: true,
    },

    // API security
    api: {
        requireAuthentication: true,
        requireCSRF: true,
        validateContentType: true,
        maxRequestSize: 1024 * 1024, // 1 MB
    },
};

/**
 * Validate security configuration
 */
export function validateSecurityConfig(): boolean {
    try {
        // Check if crypto API is available
        if (!window.crypto || !window.crypto.subtle) {
            console.error('Web Crypto API not available');
            return false;
        }

        // Check if localStorage is available
        if (!window.localStorage) {
            console.error('localStorage not available');
            return false;
        }

        // Check if sessionStorage is available
        if (!window.sessionStorage) {
            console.error('sessionStorage not available');
            return false;
        }

        return true;
    } catch (error) {
        console.error('Security configuration validation failed:', error);
        return false;
    }
}

/**
 * Get security recommendations
 */
export function getSecurityRecommendations(): string[] {
    const recommendations: string[] = [];

    // Check HTTPS
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        recommendations.push('Utilisez HTTPS pour sécuriser les communications');
    }

    // Check secure context
    if (!window.isSecureContext) {
        recommendations.push('L\'application doit être exécutée dans un contexte sécurisé');
    }

    // Check browser support
    if (!window.crypto || !window.crypto.subtle) {
        recommendations.push('Votre navigateur ne supporte pas le cryptage moderne');
    }

    return recommendations;
}

/**
 * Security event logger
 */
export class SecurityLogger {
    private static logs: Array<{
        timestamp: Date;
        event: string;
        userId?: string;
        details?: any;
    }> = [];

    static log(event: string, userId?: string, details?: any): void {
        if (!SecurityConfig.audit.enabled) return;

        if (SecurityConfig.audit.events.includes(event)) {
            this.logs.push({
                timestamp: new Date(),
                event,
                userId,
                details,
            });

            // Limiter la taille du log en mémoire
            if (this.logs.length > 1000) {
                this.logs = this.logs.slice(-500);
            }

            // En production, envoyer au serveur
            if (window.location.hostname !== 'localhost') {
                this.sendToServer({ timestamp: new Date(), event, userId, details });
            }
        }
    }

    private static async sendToServer(logEntry: any): Promise<void> {
        try {
            // Implémenter l'envoi au serveur de logs
            console.log('Security log:', logEntry);
        } catch (error) {
            console.error('Failed to send security log:', error);
        }
    }

    static getLogs(): typeof SecurityLogger.logs {
        return [...this.logs];
    }

    static clearLogs(): void {
        this.logs = [];
    }
}

export default SecurityConfig;
