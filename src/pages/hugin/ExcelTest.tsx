import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const ExcelTest = () => {
    const navigate = useNavigate();
    
    return (
        <div style={{ padding: '2rem', background: '#f5f5f5', minHeight: '100vh' }}>
            <button onClick={() => navigate('/hugin')} style={{ marginBottom: '1rem' }}>
                <ChevronLeft size={20} />
                Retour
            </button>
            <h1>Excel Test - La page fonctionne !</h1>
            <p>Si vous voyez ce message, le routage fonctionne correctement.</p>
        </div>
    );
};

export default ExcelTest;
