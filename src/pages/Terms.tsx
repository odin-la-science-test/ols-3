import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, AlertCircle } from 'lucide-react';

const Terms = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#f8fafc',
            padding: '2rem'
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        marginBottom: '2rem'
                    }}
                >
                    <ArrowLeft size={20} />
                    Retour
                </button>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <Scale size={60} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 900,
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Conditions Générales d'Utilisation
                    </h1>
                    <p style={{ color: '#94a3b8' }}>
                        Dernière mise à jour : 12 février 2026
                    </p>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                        1. Acceptation des conditions
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                        En accédant et en utilisant Odin La Science, vous acceptez d'être lié par ces conditions générales d'utilisation. 
                        Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
                    </p>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                        2. Description du service
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '1rem' }}>
                        Odin La Science est une plateforme de gestion de laboratoire et de recherche scientifique comprenant :
                    </p>
                    <ul style={{ color: '#cbd5e1', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                        <li>Munin Atlas : encyclopédie scientifique</li>
                        <li>Hugin Core : outils de gestion</li>
                        <li>Hugin Lab : outils de laboratoire</li>
                        <li>Hugin Analysis : outils d'analyse</li>
                    </ul>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                        3. Compte utilisateur
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '1rem' }}>
                        Pour utiliser nos services, vous devez :
                    </p>
                    <ul style={{ color: '#cbd5e1', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                        <li>Créer un compte avec des informations exactes</li>
                        <li>Maintenir la sécurité de votre mot de passe</li>
                        <li>Être responsable de toutes les activités sur votre compte</li>
                        <li>Nous informer immédiatement de toute utilisation non autorisée</li>
                    </ul>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                        4. Utilisation acceptable
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '1rem' }}>
                        Vous vous engagez à ne pas :
                    </p>
                    <ul style={{ color: '#cbd5e1', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                        <li>Violer les lois ou réglementations applicables</li>
                        <li>Porter atteinte aux droits de propriété intellectuelle</li>
                        <li>Transmettre des virus ou codes malveillants</li>
                        <li>Tenter d'accéder à des systèmes non autorisés</li>
                        <li>Utiliser le service à des fins illégales</li>
                    </ul>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                        5. Propriété intellectuelle
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                        Tous les contenus, fonctionnalités et technologies de la plateforme sont la propriété exclusive d'Odin La Science 
                        et sont protégés par les lois sur la propriété intellectuelle. Vous conservez tous les droits sur les données 
                        que vous téléchargez sur la plateforme.
                    </p>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                        6. Tarification et paiement
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '1rem' }}>
                        Les tarifs sont indiqués sur notre page de tarification. Vous acceptez de :
                    </p>
                    <ul style={{ color: '#cbd5e1', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                        <li>Payer tous les frais applicables</li>
                        <li>Fournir des informations de paiement exactes</li>
                        <li>Nous autoriser à facturer automatiquement votre abonnement</li>
                        <li>Accepter que les prix puissent être modifiés avec préavis</li>
                    </ul>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                        7. Résiliation
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                        Vous pouvez résilier votre compte à tout moment. Nous nous réservons le droit de suspendre ou résilier 
                        votre accès en cas de violation de ces conditions. En cas de résiliation, vos données seront conservées 
                        pendant 30 jours avant suppression définitive.
                    </p>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                        8. Limitation de responsabilité
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                        Odin La Science est fourni "tel quel". Nous ne garantissons pas que le service sera ininterrompu ou sans erreur. 
                        Notre responsabilité est limitée au montant que vous avez payé pour le service au cours des 12 derniers mois.
                    </p>
                </div>

                <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <AlertCircle size={40} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Questions sur les CGU ?
                    </h3>
                    <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                        Contactez notre équipe juridique pour toute clarification
                    </p>
                    <a href="mailto:legal@odin-la-science.com" style={{
                        display: 'inline-block',
                        padding: '1rem 2rem',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        border: 'none',
                        borderRadius: '0.75rem',
                        color: '#fff',
                        fontSize: '1rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                    }}>
                        legal@odin-la-science.com
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Terms;
