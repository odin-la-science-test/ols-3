import { useState, useEffect } from 'react';
import { Brain, Search, Play, Trophy, Clock, CheckCircle, XCircle, AlertTriangle, Eye, EyeOff, Shuffle, Lock, Camera, Monitor, FileText, BarChart, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';

interface Question {
  id: string;
  type: 'mcq' | 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  points: number;
  timeLimit?: number;
  tags: string[];
  media?: { type: 'image' | 'video'; url: string };
}

interface Exam {
  id: string;
  title: string;
  courseId: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  totalPoints: number;
  questions: Question[];
  settings: {
    showOneQuestionAtTime: boolean;
    allowBackNavigation: boolean;
    shuffleQuestions: boolean;
    shuffleAnswers: boolean;
    showResultsImmediately: boolean;
    showCorrectAnswers: boolean;
    requireWebcam: boolean;
    requireFullscreen: boolean;
    detectTabSwitch: boolean;
    allowedAttempts: number;
  };
  status: 'upcoming' | 'active' | 'completed';
}

interface ExamAttempt {
  id: string;
  examId: string;
  startedAt: Date;
  submittedAt?: Date;
  answers: { questionId: string; answer: string | string[] }[];
  score?: number;
  timeSpent: number;
  tabSwitches: number;
  violations: string[];
}

const ExamsProfessional = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'exams' | 'questions' | 'results'>('exams');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<ExamAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const exams: Exam[] = [
    {
      id: '1',
      title: 'Examen Final - Biologie Moléculaire',
      courseId: 'BIO301',
      startDate: new Date('2024-03-20T09:00:00'),
      endDate: new Date('2024-03-20T11:00:00'),
      duration: 120,
      totalPoints: 100,
      questions: [
        {
          id: 'q1',
          type: 'mcq',
          question: 'Quelle est la fonction principale de l\'ADN polymérase ?',
          options: ['Synthèse d\'ARN', 'Réplication de l\'ADN', 'Traduction', 'Transcription'],
          correctAnswer: '1',
          explanation: 'L\'ADN polymérase catalyse la synthèse de nouveaux brins d\'ADN lors de la réplication.',
          difficulty: 2,
          points: 5,
          tags: ['ADN', 'Réplication']
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          question: 'Quels sont les composants d\'un nucléotide ? (Plusieurs réponses possibles)',
          options: ['Base azotée', 'Sucre', 'Phosphate', 'Acide aminé'],
          correctAnswer: ['0', '1', '2'],
          explanation: 'Un nucléotide est composé d\'une base azotée, d\'un sucre (ribose ou désoxyribose) et d\'un groupe phosphate.',
          difficulty: 1,
          points: 3,
          tags: ['ADN', 'Structure']
        },
        {
          id: 'q3',
          type: 'true-false',
          question: 'L\'ARN contient de la thymine.',
          options: ['Vrai', 'Faux'],
          correctAnswer: '1',
          explanation: 'L\'ARN contient de l\'uracile à la place de la thymine.',
          difficulty: 1,
          points: 2,
          tags: ['ARN', 'Structure']
        },
        {
          id: 'q4',
          type: 'short-answer',
          question: 'Définissez le terme "codon".',
          correctAnswer: 'Séquence de trois nucléotides qui code pour un acide aminé',
          explanation: 'Un codon est une séquence de trois nucléotides consécutifs sur l\'ARNm qui spécifie un acide aminé particulier.',
          difficulty: 2,
          points: 5,
          tags: ['Génétique', 'Traduction']
        }
      ],
      settings: {
        showOneQuestionAtTime: true,
        allowBackNavigation: false,
        shuffleQuestions: true,
        shuffleAnswers: true,
        showResultsImmediately: false,
        showCorrectAnswers: false,
        requireWebcam: true,
        requireFullscreen: true,
        detectTabSwitch: true,
        allowedAttempts: 1
      },
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'QCM - Génétique',
      courseId: 'BIO301',
      startDate: new Date('2024-03-10T14:00:00'),
      endDate: new Date('2024-03-10T15:00:00'),
      duration: 60,
      totalPoints: 50,
      questions: [],
      settings: {
        showOneQuestionAtTime: false,
        allowBackNavigation: true,
        shuffleQuestions: false,
        shuffleAnswers: false,
        showResultsImmediately: true,
        showCorrectAnswers: true,
        requireWebcam: false,
        requireFullscreen: false,
        detectTabSwitch: false,
        allowedAttempts: 3
      },
      status: 'completed'
    }
  ];

  // Timer effect
  useEffect(() => {
    if (currentAttempt && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && currentAttempt) {
      handleSubmitExam();
    }
  }, [timeLeft, currentAttempt]);

  // Tab switch detection
  useEffect(() => {
    if (currentAttempt && selectedExam?.settings.detectTabSwitch) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setTabSwitchCount(prev => prev + 1);
          setShowWarning(true);
          setTimeout(() => setShowWarning(false), 3000);
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [currentAttempt, selectedExam]);

  const handleStartExam = (exam: Exam) => {
    if (exam.settings.requireFullscreen) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
    
    const attempt: ExamAttempt = {
      id: Date.now().toString(),
      examId: exam.id,
      startedAt: new Date(),
      answers: [],
      timeSpent: 0,
      tabSwitches: 0,
      violations: []
    };
    
    setCurrentAttempt(attempt);
    setSelectedExam(exam);
    setTimeLeft(exam.duration * 60);
    setCurrentQuestionIndex(0);
  };

  const handleAnswerQuestion = (questionId: string, answer: string | string[]) => {
    if (!currentAttempt) return;
    
    const updatedAnswers = [...currentAttempt.answers];
    const existingIndex = updatedAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingIndex >= 0) {
      updatedAnswers[existingIndex] = { questionId, answer };
    } else {
      updatedAnswers.push({ questionId, answer });
    }
    
    setCurrentAttempt({ ...currentAttempt, answers: updatedAnswers });
  };

  const handleSubmitExam = () => {
    if (!currentAttempt || !selectedExam) return;
    
    // Calculate score
    let score = 0;
    selectedExam.questions.forEach(q => {
      const userAnswer = currentAttempt.answers.find(a => a.questionId === q.id);
      if (userAnswer) {
        if (Array.isArray(q.correctAnswer)) {
          const correct = Array.isArray(userAnswer.answer) && 
            q.correctAnswer.length === userAnswer.answer.length &&
            q.correctAnswer.every(a => userAnswer.answer.includes(a));
          if (correct) score += q.points;
        } else {
          if (userAnswer.answer === q.correctAnswer) score += q.points;
        }
      }
    });
    
    const finalAttempt: ExamAttempt = {
      ...currentAttempt,
      submittedAt: new Date(),
      score,
      timeSpent: (selectedExam.duration * 60) - timeLeft,
      tabSwitches: tabSwitchCount
    };
    
    setCurrentAttempt(finalAttempt);
    
    if (isFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Exam in progress view
  if (currentAttempt && selectedExam && !currentAttempt.submittedAt) {
    const currentQuestion = selectedExam.questions[currentQuestionIndex];
    const userAnswer = currentAttempt.answers.find(a => a.questionId === currentQuestion.id);

    return (
      <div style={{ minHeight: '100vh', paddingBottom: '4rem', color: 'white', background: 'var(--bg-primary)' }}>
        {showWarning && (
          <div style={{ position: 'fixed', top: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, padding: '1rem 2rem', background: 'rgba(239, 68, 68, 0.95)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            <AlertTriangle size={24} />
            <span style={{ fontWeight: 600 }}>Attention ! Changement d'onglet détecté ({tabSwitchCount})</span>
          </div>
        )}

        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(0, 0, 0, 0.95)', padding: '1rem 2rem', zIndex: 100, borderBottom: '2px solid var(--accent-hugin)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{selectedExam.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Question {currentQuestionIndex + 1} / {selectedExam.questions.length}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: timeLeft < 300 ? '#ef4444' : 'var(--accent-hugin)' }}>
                <Clock size={24} />
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatTime(timeLeft)}</span>
              </div>
              {selectedExam.settings.requireWebcam && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
                  <Camera size={20} />
                  <span style={{ fontSize: '0.9rem' }}>Surveillance active</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container" style={{ paddingTop: '6rem', maxWidth: '900px' }}>
          <div className="card glass-panel" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ padding: '0.5rem 1rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '0.5rem', fontSize: '0.9rem' }}>
                  {currentQuestion.points} points
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Difficulté: {'★'.repeat(currentQuestion.difficulty)}{'☆'.repeat(5 - currentQuestion.difficulty)}
                </span>
              </div>
              <h3 style={{ fontSize: '1.3rem', lineHeight: 1.6 }}>{currentQuestion.question}</h3>
            </div>

            {currentQuestion.media && (
              <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                {currentQuestion.media.type === 'image' && (
                  <img src={currentQuestion.media.url} alt="Question" style={{ maxWidth: '100%', borderRadius: '0.5rem' }} />
                )}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentQuestion.type === 'mcq' && currentQuestion.options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerQuestion(currentQuestion.id, idx.toString())}
                  style={{
                    padding: '1.25rem',
                    textAlign: 'left',
                    border: '2px solid',
                    borderColor: userAnswer?.answer === idx.toString() ? 'var(--accent-hugin)' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    background: userAnswer?.answer === idx.toString() ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <span style={{ fontWeight: 600, marginRight: '1rem', color: 'var(--accent-hugin)' }}>{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </button>
              ))}

              {currentQuestion.type === 'multiple-choice' && currentQuestion.options?.map((option, idx) => (
                <label
                  key={idx}
                  style={{
                    padding: '1.25rem',
                    border: '2px solid',
                    borderColor: Array.isArray(userAnswer?.answer) && userAnswer.answer.includes(idx.toString()) ? 'var(--accent-hugin)' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    background: Array.isArray(userAnswer?.answer) && userAnswer.answer.includes(idx.toString()) ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={Array.isArray(userAnswer?.answer) && userAnswer.answer.includes(idx.toString())}
                    onChange={(e) => {
                      const currentAnswers = Array.isArray(userAnswer?.answer) ? userAnswer.answer : [];
                      const newAnswers = e.target.checked
                        ? [...currentAnswers, idx.toString()]
                        : currentAnswers.filter(a => a !== idx.toString());
                      handleAnswerQuestion(currentQuestion.id, newAnswers);
                    }}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span style={{ color: 'white', fontSize: '1rem' }}>{option}</span>
                </label>
              ))}

              {currentQuestion.type === 'short-answer' && (
                <textarea
                  value={typeof userAnswer?.answer === 'string' ? userAnswer.answer : ''}
                  onChange={(e) => handleAnswerQuestion(currentQuestion.id, e.target.value)}
                  placeholder="Votre réponse..."
                  className="input-field"
                  style={{ minHeight: '120px', resize: 'vertical' }}
                />
              )}

              {currentQuestion.type === 'essay' && (
                <textarea
                  value={typeof userAnswer?.answer === 'string' ? userAnswer.answer : ''}
                  onChange={(e) => handleAnswerQuestion(currentQuestion.id, e.target.value)}
                  placeholder="Développez votre réponse..."
                  className="input-field"
                  style={{ minHeight: '250px', resize: 'vertical' }}
                />
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0 || !selectedExam.settings.allowBackNavigation}
                className="btn-secondary"
                style={{ opacity: (currentQuestionIndex === 0 || !selectedExam.settings.allowBackNavigation) ? 0.5 : 1 }}
              >
                ← Précédent
              </button>
              
              {currentQuestionIndex < selectedExam.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  className="btn-primary"
                >
                  Suivant →
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  className="btn-primary"
                  style={{ background: '#10b981' }}
                >
                  Soumettre l'examen
                </button>
              )}
            </div>
          </div>

          {/* Question navigator */}
          {!selectedExam.settings.showOneQuestionAtTime && (
            <div className="card glass-panel" style={{ padding: '1.5rem', marginTop: '1rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Navigation</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))', gap: '0.5rem' }}>
                {selectedExam.questions.map((q, idx) => {
                  const answered = currentAttempt.answers.some(a => a.questionId === q.id);
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      style={{
                        padding: '0.75rem',
                        background: idx === currentQuestionIndex ? 'var(--accent-hugin)' : answered ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid',
                        borderColor: idx === currentQuestionIndex ? 'var(--accent-hugin)' : answered ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '0.5rem',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Results view
  if (currentAttempt && currentAttempt.submittedAt && selectedExam) {
    const percentage = ((currentAttempt.score || 0) / selectedExam.totalPoints) * 100;
    
    return (
      <div style={{ minHeight: '100vh', paddingBottom: '4rem', color: 'white' }}>
        <Navbar />
        <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
          <Trophy size={80} style={{ color: percentage >= 50 ? '#10b981' : '#ef4444', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Examen terminé !</h1>
          
          <div className="card glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            <h2 style={{ fontSize: '3rem', color: percentage >= 50 ? '#10b981' : '#ef4444', marginBottom: '1rem' }}>
              {currentAttempt.score} / {selectedExam.totalPoints}
            </h2>
            <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
              {percentage.toFixed(1)}%
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', textAlign: 'left' }}>
              <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Temps passé</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{formatTime(currentAttempt.timeSpent)}</p>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Questions répondues</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{currentAttempt.answers.length} / {selectedExam.questions.length}</p>
              </div>
              {selectedExam.settings.detectTabSwitch && (
                <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Changements d'onglet</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 600, color: currentAttempt.tabSwitches > 0 ? '#ef4444' : '#10b981' }}>
                    {currentAttempt.tabSwitches}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setCurrentAttempt(null);
                setSelectedExam(null);
                setCurrentQuestionIndex(0);
              }}
              className="btn-primary"
              style={{ marginTop: '2rem', width: '100%' }}
            >
              Retour aux examens
            </button>
          </div>

          {selectedExam.settings.showCorrectAnswers && (
            <div className="card glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Correction détaillée</h3>
              {selectedExam.questions.map((q, idx) => {
                const userAnswer = currentAttempt.answers.find(a => a.questionId === q.id);
                const isCorrect = Array.isArray(q.correctAnswer)
                  ? Array.isArray(userAnswer?.answer) && q.correctAnswer.length === userAnswer.answer.length && q.correctAnswer.every(a => userAnswer.answer.includes(a))
                  : userAnswer?.answer === q.correctAnswer;

                return (
                  <div key={q.id} style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '0.75rem', marginBottom: '1rem', borderLeft: `4px solid ${isCorrect ? '#10b981' : '#ef4444'}` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                      {isCorrect ? <CheckCircle size={24} style={{ color: '#10b981', flexShrink: 0 }} /> : <XCircle size={24} style={{ color: '#ef4444', flexShrink: 0 }} />}
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Question {idx + 1}</h4>
                        <p style={{ marginBottom: '1rem' }}>{q.question}</p>
                        <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Votre réponse:</p>
                          <p>{userAnswer ? (Array.isArray(userAnswer.answer) ? userAnswer.answer.join(', ') : userAnswer.answer) : 'Non répondu'}</p>
                        </div>
                        {!isCorrect && (
                          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Réponse correcte:</p>
                            <p>{Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}</p>
                          </div>
                        )}
                        <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem' }}>
                          <p style={{ color: 'var(--accent-hugin)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Explication:</p>
                          <p style={{ fontSize: '0.95rem' }}>{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main exams list view
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem', color: 'white' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '2rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Brain size={40} />
            QCM & Examens en Ligne
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Système d'évaluation professionnel avec anti-triche
          </p>
        </header>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {[
            { id: 'exams', label: 'Examens', icon: <FileText size={20} /> },
            { id: 'questions', label: 'Banque de questions', icon: <Brain size={20} /> },
            { id: 'results', label: 'Résultats', icon: <BarChart size={20} /> }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ padding: '1rem 1.5rem', background: 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '3px solid var(--accent-hugin)' : '3px solid transparent', color: activeTab === tab.id ? 'var(--accent-hugin)' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: activeTab === tab.id ? 600 : 400, transition: 'all 0.2s' }}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'exams' && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {exams.map(exam => (
              <div key={exam.id} className="card glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{exam.title}</h3>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={16} />
                        {exam.duration} min
                      </span>
                      <span>{exam.totalPoints} points</span>
                      <span>{exam.questions.length} questions</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {exam.settings.requireWebcam && (
                        <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '0.25rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Camera size={12} />
                          Webcam requise
                        </span>
                      )}
                      {exam.settings.requireFullscreen && (
                        <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', borderRadius: '0.25rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Monitor size={12} />
                          Plein écran
                        </span>
                      )}
                      {exam.settings.detectTabSwitch && (
                        <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-hugin)', borderRadius: '0.25rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Eye size={12} />
                          Surveillance
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ padding: '0.5rem 1rem', background: exam.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : exam.status === 'upcoming' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(99, 102, 241, 0.2)', color: exam.status === 'active' ? '#10b981' : exam.status === 'upcoming' ? '#f59e0b' : 'var(--accent-hugin)', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                    {exam.status === 'active' ? 'En cours' : exam.status === 'upcoming' ? 'À venir' : 'Terminé'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {exam.status === 'active' && (
                    <button onClick={() => handleStartExam(exam)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Play size={16} />
                      Commencer
                    </button>
                  )}
                  <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Eye size={16} />
                    Détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="card glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <Brain size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Banque de questions</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Créez et gérez vos questions pour les examens
            </p>
            <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={20} />
              Nouvelle question
            </button>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="card glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <BarChart size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Résultats et statistiques</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Analyses détaillées des performances
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamsProfessional;
