export interface UserSignature {
    email: string;
    firstName: string;
    lastName: string;
    title: string;
    company: string;
    phone?: string;
    website?: string;
}

const OLS_SIGNATURES: Record<string, UserSignature> = {
    'bastien.astolfi@OLS.com': {
        email: 'bastien.astolfi@OLS.com',
        firstName: 'Bastien',
        lastName: 'Astolfi',
        title: 'Directeur et Fondateur',
        company: 'Odin la Science',
        phone: '+33 1 23 45 67 89',
        website: 'odin-la-science.com'
    },
    'ethan.difraja@OLS.com': {
        email: 'ethan.difraja@OLS.com',
        firstName: 'Ethan',
        lastName: 'Di Fraja',
        title: 'Directeur et Fondateur',
        company: 'Odin la Science',
        phone: '+33 1 23 45 67 90',
        website: 'odin-la-science.com'
    },
    'issam.ouali@OLS.com': {
        email: 'issam.ouali@OLS.com',
        firstName: 'Issam',
        lastName: 'Ouali',
        title: 'Directeur et Fondateur',
        company: 'Odin la Science',
        phone: '+33 1 23 45 67 91',
        website: 'odin-la-science.com'
    }
};

export const getUserSignature = (email: string): UserSignature | null => {
    const normalizedEmail = email.toLowerCase();
    return OLS_SIGNATURES[normalizedEmail] || null;
};

export const generateSignatureHTML = (signature: UserSignature): string => {
    return `
<div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 2px solid #10b981; font-family: 'Inter', sans-serif;">
    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; color: white;">
            ${signature.firstName.charAt(0)}${signature.lastName.charAt(0)}
        </div>
        <div>
            <div style="font-size: 1.1rem; font-weight: 700; color: #f8fafc; margin-bottom: 0.25rem;">
                ${signature.firstName} ${signature.lastName}
            </div>
            <div style="font-size: 0.9rem; color: #10b981; font-weight: 600;">
                ${signature.title}
            </div>
        </div>
    </div>
    <div style="font-size: 0.9rem; color: #94a3b8; line-height: 1.6;">
        <div style="margin-bottom: 0.5rem;">
            <strong style="color: #cbd5e1;">${signature.company}</strong>
        </div>
        ${signature.phone ? `<div>📞 ${signature.phone}</div>` : ''}
        <div>📧 <a href="mailto:${signature.email}" style="color: #10b981; text-decoration: none;">${signature.email}</a></div>
        ${signature.website ? `<div>🌐 <a href="https://${signature.website}" style="color: #10b981; text-decoration: none;">${signature.website}</a></div>` : ''}
    </div>
    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 0.75rem; color: #64748b; font-style: italic;">
        "La science à portée de main" - Odin la Science
    </div>
</div>
    `.trim();
};

export const generateSignatureText = (signature: UserSignature): string => {
    return `

---
${signature.firstName} ${signature.lastName}
${signature.title}
${signature.company}
${signature.phone ? `📞 ${signature.phone}` : ''}
📧 ${signature.email}
${signature.website ? `🌐 ${signature.website}` : ''}

"La science à portée de main" - Odin la Science
    `.trim();
};

export const hasOLSSignature = (email: string): boolean => {
    return email.toLowerCase().endsWith('@ols.com');
};
