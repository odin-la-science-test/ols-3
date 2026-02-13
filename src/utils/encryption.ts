/**
 * Encryption & Security Utilities
 * Provides AES-256-GCM encryption for sensitive data
 */

// Generate a secure encryption key from password
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
    );

    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt.buffer as ArrayBuffer,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}

// Generate random salt
function generateSalt(): Uint8Array {
    return window.crypto.getRandomValues(new Uint8Array(16));
}

// Generate random IV (Initialization Vector)
function generateIV(): Uint8Array {
    return window.crypto.getRandomValues(new Uint8Array(12));
}

/**
 * Encrypt data using AES-256-GCM
 */
export async function encryptData(data: string, password: string): Promise<string> {
    try {
        const salt = generateSalt();
        const iv = generateIV();
        const key = await deriveKey(password, salt);
        
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);
        
        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv.buffer as ArrayBuffer
            },
            key,
            encodedData
        );
        
        // Combine salt + iv + encrypted data
        const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(new Uint8Array(encryptedData), salt.length + iv.length);
        
        // Convert to base64
        return btoa(String.fromCharCode(...combined));
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
}

/**
 * Decrypt data using AES-256-GCM
 */
export async function decryptData(encryptedData: string, password: string): Promise<string> {
    try {
        // Decode from base64
        const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
        
        // Extract salt, iv, and encrypted data
        const salt = combined.slice(0, 16);
        const iv = combined.slice(16, 28);
        const data = combined.slice(28);
        
        const key = await deriveKey(password, salt);
        
        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv.buffer as ArrayBuffer
            },
            key,
            data.buffer as ArrayBuffer
        );
        
        const decoder = new TextDecoder();
        return decoder.decode(decryptedData);
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data - invalid password or corrupted data');
    }
}

/**
 * Hash password using SHA-256
 */
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Check password strength
 */
export function checkPasswordStrength(password: string): {
    score: number;
    feedback: string[];
} {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score++;
    else feedback.push('Au moins 8 caractères requis');

    if (password.length >= 12) score++;
    
    if (/[a-z]/.test(password)) score++;
    else feedback.push('Ajoutez des lettres minuscules');
    
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Ajoutez des lettres majuscules');
    
    if (/[0-9]/.test(password)) score++;
    else feedback.push('Ajoutez des chiffres');
    
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    else feedback.push('Ajoutez des caractères spéciaux');

    return { score, feedback };
}

/**
 * Generate encryption key for user session
 */
export async function generateUserEncryptionKey(userId: string, password: string): Promise<string> {
    const combined = `${userId}:${password}:${Date.now()}`;
    return await hashPassword(combined);
}

/**
 * Secure localStorage wrapper with encryption
 */
export const SecureStorage = {
    async setItem(key: string, value: any, password: string): Promise<void> {
        try {
            const jsonValue = JSON.stringify(value);
            const encrypted = await encryptData(jsonValue, password);
            localStorage.setItem(key, encrypted);
        } catch (error) {
            console.error('SecureStorage setItem error:', error);
            throw error;
        }
    },

    async getItem(key: string, password: string): Promise<any> {
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;
            
            const decrypted = await decryptData(encrypted, password);
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('SecureStorage getItem error:', error);
            return null;
        }
    },

    removeItem(key: string): void {
        localStorage.removeItem(key);
    },

    clear(): void {
        localStorage.clear();
    }
};

/**
 * Session token management
 */
export class SessionManager {
    private static readonly SESSION_KEY = 'odin_session';
    private static readonly TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

    static createSession(userId: string): string {
        const token = generateSecureToken(64);
        const session = {
            userId,
            token,
            createdAt: Date.now(),
            expiresAt: Date.now() + this.TOKEN_EXPIRY
        };
        
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        return token;
    }

    static validateSession(): boolean {
        try {
            const sessionData = localStorage.getItem(this.SESSION_KEY);
            if (!sessionData) return false;

            const session = JSON.parse(sessionData);
            if (Date.now() > session.expiresAt) {
                this.destroySession();
                return false;
            }

            return true;
        } catch {
            return false;
        }
    }

    static refreshSession(): void {
        try {
            const sessionData = localStorage.getItem(this.SESSION_KEY);
            if (!sessionData) return;

            const session = JSON.parse(sessionData);
            session.expiresAt = Date.now() + this.TOKEN_EXPIRY;
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        } catch (error) {
            console.error('Session refresh error:', error);
        }
    }

    static destroySession(): void {
        localStorage.removeItem(this.SESSION_KEY);
    }

    static getSessionData(): { userId: string; token: string } | null {
        try {
            const sessionData = localStorage.getItem(this.SESSION_KEY);
            if (!sessionData) return null;

            const session = JSON.parse(sessionData);
            return {
                userId: session.userId,
                token: session.token
            };
        } catch {
            return null;
        }
    }
}

/**
 * CSRF Token management
 */
export class CSRFProtection {
    private static readonly CSRF_KEY = 'odin_csrf_token';

    static generateToken(): string {
        const token = generateSecureToken(32);
        sessionStorage.setItem(this.CSRF_KEY, token);
        return token;
    }

    static getToken(): string | null {
        return sessionStorage.getItem(this.CSRF_KEY);
    }

    static validateToken(token: string): boolean {
        const storedToken = this.getToken();
        return storedToken === token;
    }

    static clearToken(): void {
        sessionStorage.removeItem(this.CSRF_KEY);
    }
}

/**
 * Rate limiting for API calls
 */
export class RateLimiter {
    private attempts: Map<string, number[]> = new Map();
    private readonly maxAttempts: number;
    private readonly windowMs: number;

    constructor(maxAttempts: number = 5, windowMs: number = 60000) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
    }

    checkLimit(identifier: string): boolean {
        const now = Date.now();
        const attempts = this.attempts.get(identifier) || [];
        
        // Remove old attempts outside the window
        const recentAttempts = attempts.filter(time => now - time < this.windowMs);
        
        if (recentAttempts.length >= this.maxAttempts) {
            return false; // Rate limit exceeded
        }

        recentAttempts.push(now);
        this.attempts.set(identifier, recentAttempts);
        return true;
    }

    reset(identifier: string): void {
        this.attempts.delete(identifier);
    }
}

/**
 * Content Security Policy headers (for server-side implementation)
 */
export const CSP_HEADERS = {
    'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' https://api.odin-la-science.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

export default {
    encryptData,
    decryptData,
    hashPassword,
    generateSecureToken,
    sanitizeInput,
    isValidEmail,
    checkPasswordStrength,
    generateUserEncryptionKey,
    SecureStorage,
    SessionManager,
    CSRFProtection,
    RateLimiter,
    CSP_HEADERS
};
