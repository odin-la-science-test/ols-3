import { useState, useEffect } from 'react';
import { BookOpen, Video, FileText, MessageSquare, Users, Award, Calendar, TrendingUp, Upload, Download, Lock, CheckCircle, Clock, Play, Pause, ChevronRight, ChevronDown, Plus, Edit, Trash2, Eye, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';

interface Course {
  id: string;
  title: string;
  code: string;
  instructor: { id: string; name: string; email: string; avatar: string };
  semester: string;
  credits: number;
  category: string;
  level: 'L1' | 'L2' | 'L3' | 'M1' | 'M2';
  sections: CourseSection[];
  enrollment: { isOpen: boolean; maxStudents: number; currentStudents: number; startDate: Date; endDate: Date };
  grading: { passingGrade: number; weightings: { quizzes: number; assignments: number; midterm: number; final: number; participation: number } };
}

interface CourseSection {
  id: string;
  title: string;
  order: number;
  description: string;
  lessons: Lesson[];
  isLocked: boolean;
  unlockDate?: Date;
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment' | 'discussion' | 'live';
  content: any;
  duration: number;
  isRequired: boolean;
  isCompleted: boolean;
}

interface Assignment {
  id: string;
  title: string;
  courseId: string;
  dueDate: Date;
  maxPoints: number;
  description: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded';
  grade?: number;
  feedback?: string;
  submittedAt?: Date;
}

const LMSProfessional = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'courses' | 'assignments' | 'grades' | 'calendar'>('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const courses: Course[] = [
    {
      id: '1',
      title: 'Biologie Moléculaire Avancée',
      code: 'BIO301',
      instructor: { id: '1', name: 'Dr. Martin', email: 'martin@univ.fr', avatar: '' },
      semester: 'Automne 2024',
      credits: 6,
      category: 'Biologie',
      level: 'L3',
      sections: [
        {
          id: 's1',
          title: 'Introduction à la Biologie Moléculaire',
          order: 1,
          description: 'Concepts fondamentaux',
          lessons: [
            { id: 'l1', title: 'Structure de l\'ADN', type: 'video', content: {}, duration: 45, isRequired: true, isCompleted: true },
            { id: 'l2', title: 'Réplication de l\'ADN', type: 'document', content: {}, duration: 30, isRequired: true, isCompleted: true },
            { id: 'l3', title: 'Quiz - ADN', type: 'quiz', content: {}, duration: 15, isRequired: true, isCompleted: false }
          ],
          isLocked: false
        },
        {
          id: 's2',
          title: 'Transcription et Traduction',
          order: 2,
          description: 'Expression génique',
          lessons: [
            { id: 'l4', title: 'Transcription', type: 'video', content: {}, duration: 50, isRequired: true, isCompleted: false },
            { id: 'l5', title: 'Traduction', type: 'video', content: {}, duration: 45, isRequired: true, isCompleted: false }
          ],
          isLocked: false
        }
      ],
      enrollment: { isOpen: true, maxStudents: 50, currentStudents: 42, startDate: new Date('2024-09-01'), endDate: new Date('2024-12-20') },
      grading: { passingGrade: 10, weightings: { quizzes: 20, assignments: 30, midterm: 20, final: 25, participation: 5 } }
    }
  ];

  const assignments: Assignment[] = [
    {
      id: 'a1',
      title: 'Rapport TP - Extraction ADN',
      courseId: '1',
      dueDate: new Date('2024-03-15'),
      maxPoints: 20,
      description: 'Rédiger un rapport complet sur l\'extraction d\'ADN',
      status: 'in_progress'
    },
    {
      id: 'a2',
      title: 'Analyse de séquence',
      courseId: '1',
      dueDate: new Date('2024-03-20'),
      maxPoints: 15,
      description: 'Analyser la séquence fournie',
      status: 'not_started'
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
    );
  };

  const calculateProgress = (course: Course) => {
    const allLessons = course.sections.flatMap(s => s.lessons);
    const completed = allLessons.filter(l => l.isCompleted).length;
    return (completed / allLessons.length) * 100;
  };

  if (selectedCourse) {
    return (
      <div style={{ minHeight: '100vh', paddingBottom: '4rem', color: 'white' }}>
        <Navbar />
        <div className="container" style={{ paddingTop: '2rem' }}>
          <button onClick={() => setSelectedCourse(null)} className="btn-secondary" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ← Retour aux cours
          </button>

          <div className="card glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{selectedCourse.title}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                  {selectedCourse.code} • {selectedCourse.instructor.name} • {selectedCourse.credits} crédits
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-hugin)' }}>
                  {calculateProgress(selectedCourse).toFixed(0)}%
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Progression</p>
              </div>
            </div>

            <div style={{ width: '100%', height: '12px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '1rem', overflow: 'hidden' }}>
              <div style={{ width: `${calculateProgress(selectedCourse)}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-hugin), #818cf8)', transition: 'width 0.3s' }} />
            </div>
          </div>

          {selectedCourse.sections.map(section => (
            <div key={section.id} className="card glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              <div onClick={() => toggleSection(section.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {expandedSections.includes(section.id) ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                  <div>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{section.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{section.description}</p>
                  </div>
                </div>
                {section.isLocked && <Lock size={20} style={{ color: 'var(--text-secondary)' }} />}
              </div>

              {expandedSections.includes(section.id) && !section.isLocked && (
                <div style={{ marginTop: '1.5rem', paddingLeft: '2.5rem' }}>
                  {section.lessons.map(lesson => (
                    <div key={lesson.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ padding: '0.5rem', background: lesson.isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)', borderRadius: '0.5rem' }}>
                        {lesson.type === 'video' && <Video size={20} style={{ color: lesson.isCompleted ? '#10b981' : 'var(--accent-hugin)' }} />}
                        {lesson.type === 'document' && <FileText size={20} style={{ color: lesson.isCompleted ? '#10b981' : 'var(--accent-hugin)' }} />}
                        {lesson.type === 'quiz' && <Award size={20} style={{ color: lesson.isCompleted ? '#10b981' : 'var(--accent-hugin)' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{lesson.title}</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{lesson.duration} min</p>
                      </div>
                      {lesson.isCompleted && <CheckCircle size={20} style={{ color: '#10b981' }} />}
                      {lesson.isRequired && !lesson.isCompleted && <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Requis</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem', color: 'white' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '2rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BookOpen size={40} />
            Plateforme d'Apprentissage (LMS)
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Système de gestion de l'apprentissage professionnel
          </p>
        </header>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {[
            { id: 'courses', label: 'Mes Cours', icon: <BookOpen size={20} /> },
            { id: 'assignments', label: 'Devoirs', icon: <FileText size={20} /> },
            { id: 'grades', label: 'Notes', icon: <Award size={20} /> },
            { id: 'calendar', label: 'Calendrier', icon: <Calendar size={20} /> }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ padding: '1rem 1.5rem', background: 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '3px solid var(--accent-hugin)' : '3px solid transparent', color: activeTab === tab.id ? 'var(--accent-hugin)' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: activeTab === tab.id ? 600 : 400, transition: 'all 0.2s' }}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'courses' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {courses.map(course => (
              <div key={course.id} className="card glass-panel" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setSelectedCourse(course)} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '0.75rem', color: 'var(--accent-hugin)' }}>
                    <BookOpen size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{course.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{course.code} • {course.instructor.name}</p>
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Progression</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-hugin)' }}>{calculateProgress(course).toFixed(0)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '1rem', overflow: 'hidden' }}>
                    <div style={{ width: `${calculateProgress(course)}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-hugin), #818cf8)', transition: 'width 0.3s' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span>{course.credits} crédits</span>
                  <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '1rem', fontSize: '0.8rem' }}>{course.level}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'assignments' && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {assignments.map(assignment => (
              <div key={assignment.id} className="card glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{assignment.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{assignment.description}</p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={14} />
                        Échéance: {assignment.dueDate.toLocaleDateString('fr-FR')}
                      </span>
                      <span>{assignment.maxPoints} points</span>
                    </div>
                  </div>
                  <div style={{ padding: '0.5rem 1rem', background: assignment.status === 'submitted' ? 'rgba(16, 185, 129, 0.2)' : assignment.status === 'in_progress' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: assignment.status === 'submitted' ? '#10b981' : assignment.status === 'in_progress' ? '#f59e0b' : '#ef4444', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                    {assignment.status === 'submitted' ? 'Soumis' : assignment.status === 'in_progress' ? 'En cours' : 'À faire'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Upload size={16} />
                    Soumettre
                  </button>
                  <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Eye size={16} />
                    Détails
                  </button>
                </div>
              </div>
            ))}
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
                <div key={course.id} style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{course.title}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{course.instructor.name}</p>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: calculateProgress(course) >= 80 ? '#10b981' : calculateProgress(course) >= 60 ? '#f59e0b' : '#ef4444' }}>
                    {(calculateProgress(course) * 0.2).toFixed(1)}/20
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="card glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Calendrier académique</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Vue calendrier des cours et échéances</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LMSProfessional;
