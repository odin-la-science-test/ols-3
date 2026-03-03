import { useState, useEffect } from 'react';
import { Brain, Search, Play, Trophy, Clock, CheckCircle, XCircle, ArrowLeft, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

interface Question {
  id: string;
  discipline: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QCMMultiDisciplines = () => {
  const navigate = useNavigate();
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [quizMode, setQuizMode] = useState<'revision' | 'exam' | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [quizStarted, setQuizStarted] = useState(false);

  const disciplines = [
    'Biologie cellulaire', 'Biologie moléculaire', 'Génétique', 'Microbiologie',
    'Immunologie', 'Biochimie', 'Chimie organique', 'Chimie analytique',
    'Pharmacologie', 'Physiologie', 'Anatomie', 'Écologie'
  ];

  const questions: Question[] = [
    {
      id: '1',
      discipline: 'Biologie cellulaire',
      level: 'beginner',
      question: 'Quelle est la fonction principale des mitochondries ?',
      options: ['Synthèse protéique', 'Production d\'ATP', 'Digestion cellulaire', 'Stockage de l\'ADN'],
      correctAnswer: 1,
      explanation: 'Les mitochondries sont les centrales énergétiques de la cellule, produisant l\'ATP par phosphorylation oxydative.'
    },
    {
      id: '2',
      discipline: 'Microbiologie',
      level: 'intermediate',
      question: 'Quel est le mécanisme d\'action des β-lactamines ?',
      options: [
        'Inhibition de la synthèse protéique',
        'Inhibition de la synthèse de la paroi cellulaire',
        'Inhibition de la réplication de l\'ADN',
        'Perturbation de la membrane cytoplasmique'
      ],
      correctAnswer: 1,
      explanation: 'Les β-lactamines inhibent les transpeptidases (PBP) impliquées dans la synthèse du peptidoglycane de la paroi bactérienne.'
    }
  ];

  const currentQuestions = selectedDiscipline
    ? questions.filter(q => q.discipline === selectedDiscipline)
    : questions;

  useEffect(() => {
    if (quizStarted && quizMode === 'exam' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0) {
      handleFinishQuiz();
    }
  }, [quizStarted, timeLeft, quizMode]);

  const handleStartQuiz = (mode: 'revision' | 'exam') => {
    setQuizMode(mode);
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResult(false);
    setTimeLeft(600);
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);

    if (quizMode === 'revision') {
      setShowResult(true);
    } else if (currentQuestionIndex < currentQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowResult(false);
      }, 500);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    setQuizStarted(false);
    setShowResult(true);
  };

  const calculateScore = () => {
    let correct = 0;
    userAnswers.forEach((answer, idx) => {
      if (answer === currentQuestions[idx].correctAnswer) correct++;
    });
    return { correct, total: currentQuestions.length, percentage: (correct / currentQuestions.length) * 100 };
  };

  if (!quizStarted && !showResult) {
    return (
      <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
        <Navbar />
        
        <div className="container" style={{ paddingTop: '2rem', color: 'white' }}>
          <header style={{ marginBottom: '2rem' }}>
            <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Brain size={40} />
              QCM Multi-Disciplines
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              2000+ questions pour tester vos connaissances
            </p>
          </header>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Choisir une discipline</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {disciplines.map(disc => (
                <button
                  key={disc}
                  onClick={() => setSelectedDiscipline(disc)}
                  className="card glass-panel"
                  style={{
                    padding: '1.5rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    border: selectedDiscipline === disc ? '2px solid var(--accent-hugin)' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: selectedDiscipline === disc ? 'rgba(99, 102, 241, 0.1)' : undefined,
                    color: 'white'
                  }}
                >
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white' }}>{disc}</h3>
                  <p style={{ color: 'white', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    {questions.filter(q => q.discipline === disc).length} questions
                  </p>
                </button>
              ))}
            </div>
          </div>

          {selectedDiscipline && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => handleStartQuiz('revision')}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem' }}
              >
                <Play size={20} />
                Mode Révision
              </button>
              <button
                onClick={() => handleStartQuiz('exam')}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem' }}
              >
                <Clock size={20} />
                Mode Examen
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showResult && !quizStarted) {
    const score = calculateScore();
    return (
      <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
        <Navbar />
        
        <div className="container" style={{ paddingTop: '2rem', textAlign: 'center', color: 'white' }}>
          <Trophy size={80} style={{ color: '#10b981', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Quiz terminé !</h1>
          
          <div className="card glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', color: 'white' }}>
            <h2 style={{ fontSize: '3rem', color: 'var(--accent-hugin)', marginBottom: '1rem' }}>
              {score.percentage.toFixed(0)}%
            </h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'white' }}>
              {score.correct} / {score.total} réponses correctes
            </p>

            <button
              onClick={() => {
                setSelectedDiscipline(null);
                setShowResult(false);
              }}
              className="btn-primary"
            >
              Nouveau Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = currentQuestions[currentQuestionIndex];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '2rem', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>
              Question {currentQuestionIndex + 1} / {currentQuestions.length}
            </span>
          </div>
          {quizMode === 'exam' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: timeLeft < 60 ? '#ef4444' : 'var(--accent-hugin)' }}>
              <Clock size={20} />
              <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        <div className="card glass-panel" style={{ padding: '2rem', color: 'white' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'white' }}>{currentQuestion.question}</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => !showResult && handleAnswer(idx)}
                disabled={showResult}
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  border: '2px solid',
                  borderColor: showResult
                    ? idx === currentQuestion.correctAnswer
                      ? '#10b981'
                      : userAnswers[currentQuestionIndex] === idx
                      ? '#ef4444'
                      : 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.75rem',
                  background: showResult
                    ? idx === currentQuestion.correctAnswer
                      ? 'rgba(16, 185, 129, 0.1)'
                      : userAnswers[currentQuestionIndex] === idx
                      ? 'rgba(239, 68, 68, 0.1)'
                      : 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.05)',
                  cursor: showResult ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  color: 'white'
                }}
              >
                {option}
              </button>
            ))}
          </div>

          {showResult && quizMode === 'revision' && (
            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.75rem', color: 'white' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent-hugin)' }}>Explication</h3>
              <p style={{ color: 'white' }}>{currentQuestion.explanation}</p>
              
              <button
                onClick={() => {
                  if (currentQuestionIndex < currentQuestions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                    setShowResult(false);
                  } else {
                    handleFinishQuiz();
                  }
                }}
                className="btn-primary"
                style={{ marginTop: '1rem' }}
              >
                Question suivante
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QCMMultiDisciplines;
