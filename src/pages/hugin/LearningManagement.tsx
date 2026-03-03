import { useState } from 'react';
import { BookOpen, Video, FileText, MessageSquare, Users, Award, Calendar, TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  category: string;
}

const LearningManagement = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'assignments' | 'grades'>('courses');

  const courses: Course[] = [
    {
      id: '1',
      title: 'Biologie Moléculaire Avancée',
      instructor: 'Dr. Martin',
      progress: 65,
      totalLessons: 20,
      completedLessons: 13,
      category: 'Biologie'
    },
    {
      id: '2',
      title: 'Techniques de Microbiologie',
      instructor: 'Prof. Dubois',
      progress: 40,
      totalLessons: 15,
      completedLessons: 6,
      category: 'Microbiologie'
    },
    {
      id: '3',
      title: 'Chimie Analytique',
      instructor: 'Dr. Laurent',
      progress: 85,
      totalLessons: 12,
      completedLessons: 10,
      category: 'Chimie'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '2rem', color: 'white' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BookOpen size={40} />
            Plateforme d'Apprentissage (LMS)
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Gestion complète de vos cours et formations
          </p>
        </header>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {[
            { id: 'courses', label: 'Mes Cours', icon: <BookOpen size={20} /> },
            { id: 'assignments', label: 'Devoirs', icon: <FileText size={20} /> },
            { id: 'grades', label: 'Notes', icon: <Award size={20} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '1rem 1.5rem',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid var(--accent-hugin)' : '3px solid transparent',
                color: activeTab === tab.id ? 'var(--accent-hugin)' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: activeTab === tab.id ? 600 : 400,
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'courses' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {courses.map(course => (
              <div
                key={course.id}
                className="card glass-panel"
                style={{ padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setSelectedCourse(course)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ 
                    padding: '0.75rem', 
                    background: 'rgba(99, 102, 241, 0.15)', 
                    borderRadius: '0.75rem', 
                    color: 'var(--accent-hugin)'
                  }}>
                    <BookOpen size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      {course.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {course.instructor}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Progression
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-hugin)' }}>
                      {course.progress}%
                    </span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '1rem',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${course.progress}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, var(--accent-hugin), #818cf8)',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span>{course.completedLessons} / {course.totalLessons} leçons</span>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    background: 'rgba(99, 102, 241, 0.2)', 
                    borderRadius: '1rem',
                    fontSize: '0.8rem'
                  }}>
                    {course.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="card glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Aucun devoir en cours</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Les devoirs assignés apparaîtront ici
            </p>
          </div>
        )}

        {activeTab === 'grades' && (
          <div className="card glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={24} />
              Tableau de notes
            </h2>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {courses.map(course => (
                <div key={course.id} style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  borderRadius: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{course.title}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{course.instructor}</p>
                  </div>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 700, 
                    color: course.progress >= 80 ? '#10b981' : course.progress >= 60 ? '#f59e0b' : '#ef4444'
                  }}>
                    {(course.progress * 0.2).toFixed(1)}/20
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningManagement;
