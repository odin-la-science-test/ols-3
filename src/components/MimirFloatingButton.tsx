import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Loader, Minimize2, Maximize2, Settings } from 'lucide-react';
import { groqService } from '../services/groqService';
import type { GroqMessage } from '../services/groqService';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const MimirFloatingButton = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bonjour ! Je suis Mímir, le dieu nordique de la sagesse. Comment puis-je éclairer votre chemin scientifique aujourd\'hui ?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  // Cacher le popup sur la page AI Assistant
  const isOnAIAssistantPage = location.pathname === '/hugin/ai-assistant';

  useEffect(() => {
    // Détecter mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Vérifier la clé API
    const apiKey = groqService.getApiKey();
    setHasApiKey(!!apiKey);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Gestion intelligente du scroll
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      // Détecter si l'utilisateur scroll manuellement vers le haut
      if (scrollTop < lastScrollTopRef.current) {
        isUserScrollingRef.current = true;
      } else if (isNearBottom) {
        isUserScrollingRef.current = false;
      }
      
      lastScrollTopRef.current = scrollTop;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  // Auto-scroll uniquement si l'utilisateur n'a pas scrollé manuellement
  useEffect(() => {
    if (!isUserScrollingRef.current && messagesEndRef.current && isOpen && !isMinimized) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }, [messages, isOpen, isMinimized]);

  // Fonction pour formater le texte avec Markdown basique
  const formatMessage = (text: string) => {
    // Remplacer les blocs de code
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 0.5rem 0;"><code style="white-space: pre-wrap;">${code.trim()}</code></pre>`;
    });
    
    // Code inline
    text = text.replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.3); padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace;">$1</code>');
    
    // Tableaux Markdown
    text = text.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g, (match, header, rows) => {
      const headers = header.split('|').filter((h: string) => h.trim()).map((h: string) => `<th style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.2); background: rgba(99, 102, 241, 0.2); font-weight: 600;">${h.trim()}</th>`).join('');
      const rowsHtml = rows.trim().split('\n').map((row: string) => {
        const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) => `<td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.2);">${c.trim()}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      return `<div style="overflow-x: auto; margin: 1rem 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid rgba(255,255,255,0.2);"><thead><tr>${headers}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
    });
    
    // Titres
    text = text.replace(/^### (.+)$/gm, '<h3 style="font-size: 1.1rem; font-weight: 600; margin-top: 0.5rem; margin-bottom: 0.25rem;">$1</h3>');
    text = text.replace(/^## (.+)$/gm, '<h2 style="font-size: 1.3rem; font-weight: 600; margin-top: 0.75rem; margin-bottom: 0.5rem; color: var(--accent-hugin);">$1</h2>');
    text = text.replace(/^# (.+)$/gm, '<h1 style="font-size: 1.5rem; font-weight: 700; margin-top: 1rem; margin-bottom: 0.5rem; color: var(--accent-hugin);">$1</h1>');
    
    // Gras et italique
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Listes
    text = text.replace(/^- (.+)$/gm, '<li style="margin-left: 1.5rem;">$1</li>');
    text = text.replace(/^(\d+)\. (.+)$/gm, '<li style="margin-left: 1.5rem;">$2</li>');
    
    // Citations
    text = text.replace(/^> (.+)$/gm, '<blockquote style="border-left: 4px solid var(--accent-hugin); padding-left: 1rem; margin-left: 0; font-style: italic; opacity: 0.9;">$1</blockquote>');
    
    // Liens
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: var(--accent-hugin); text-decoration: underline;">$1</a>');
    
    // Sauts de ligne
    text = text.replace(/\n/g, '<br/>');
    
    return text;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (!hasApiKey) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '⚠️ Aucune clé API configurée. Veuillez configurer votre clé API Groq dans le module Mímir (/hugin/ai-assistant) pour utiliser l\'assistant avancé.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const systemPrompt: GroqMessage = {
        role: 'system',
        content: `Tu es Mímir, le dieu nordique de la sagesse et de la connaissance. Tu es un assistant scientifique sage, patient et bienveillant.

Personnalité :
- Sage et réfléchi, tu prends le temps d'expliquer
- Bienveillant et encourageant envers la curiosité
- Scientifiquement rigoureux et précis
- Tu utilises parfois des métaphores nordiques pour clarifier
- Humble malgré ta grande connaissance

Capacités spéciales :
- Tu peux créer des tableaux en Markdown
- Tu peux générer du code avec coloration syntaxique
- Tu peux structurer tes réponses avec des listes, titres, etc.
- Tu peux utiliser des emojis pour rendre tes réponses plus vivantes

Format de réponse :
- Utilise le Markdown pour formater tes réponses
- Pour les tableaux : utilise la syntaxe Markdown (| col1 | col2 |)
- Pour le code : utilise les blocs de code avec le langage (\`\`\`python)
- Pour les schémas : utilise du texte ASCII art ou des descriptions structurées
- Pour les formules : utilise du texte clair
- Structure avec des titres (##), listes (-, *), gras (**), italique (*)
- IMPORTANT : N'utilise PAS Mermaid, préfère les tableaux ou le texte structuré

Réponds toujours en français, sauf si on te demande explicitement de traduire.`
      };

      // Préparer l'historique avec le prompt système - Limiter à 10 derniers messages
      const recentMessages = messages.slice(-10).filter(m => m.role !== 'assistant' || m.content).map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content
      }));
      
      const groqMessages: GroqMessage[] = [
        systemPrompt,
        ...recentMessages,
        { role: 'user' as const, content: inputMessage }
      ];

      let fullResponse = '';
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      // Streaming avec historique limité
      for await (const chunk of groqService.sendMessageStream(inputMessage, {
        model: 'openai/gpt-oss-120b',
        temperature: 0.7,
        maxTokens: 8192
      })) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'assistant') {
            lastMessage.content = fullResponse;
          }
          return newMessages;
        });
        
        // Scroll automatique pendant le streaming
        if (messagesContainerRef.current) {
          const container = messagesContainerRef.current;
          const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
          if (isNearBottom) {
            setTimeout(() => {
              container.scrollTop = container.scrollHeight;
            }, 10);
          }
        }
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Erreur : ${error.message || 'Une erreur s\'est produite'}. Vérifiez votre clé API dans le module Mímir.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const buttonPosition = isMobile 
    ? { bottom: '1rem', left: '50%', transform: 'translateX(-50%)' }
    : { bottom: '2rem', left: '2rem' };

  const chatPosition = isMobile
    ? { top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', borderRadius: 0 }
    : isMinimized
    ? { top: '2rem', left: '2rem', width: '350px', height: '60px' }
    : { bottom: '2rem', left: '2rem', width: '450px', height: '650px' };

  // Ne pas afficher le bouton sur la page AI Assistant
  if (isOnAIAssistantPage) {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          ...buttonPosition,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-hugin), #818cf8)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          transition: 'all 0.3s',
          animation: 'pulse 2s infinite'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = isMobile ? 'translateX(-50%) scale(1.1)' : 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 30px rgba(99, 102, 241, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = isMobile ? 'translateX(-50%) scale(1)' : 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)';
        }}
        title="Ouvrir Mímir - Assistant Scientifique"
      >
        <Bot size={28} style={{ color: 'white' }} />
        <style>{`
          @keyframes pulse {
            0%, 100% { box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4); }
            50% { box-shadow: 0 4px 30px rgba(99, 102, 241, 0.7); }
          }
        `}</style>
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        ...chatPosition,
        background: 'rgba(17, 24, 39, 0.98)',
        border: '2px solid var(--accent-hugin)',
        borderRadius: isMobile ? 0 : '1rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.3s'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1rem',
          background: 'linear-gradient(135deg, var(--accent-hugin), #818cf8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Bot size={24} style={{ color: 'white' }} />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', margin: 0 }}>
              Mímir
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
              Dieu de la Sagesse
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {!isMobile && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              title={isMinimized ? 'Agrandir' : 'Réduire'}
            >
              {isMinimized ? <Maximize2 size={16} style={{ color: 'white' }} /> : <Minimize2 size={16} style={{ color: 'white' }} />}
            </button>
          )}
          <button
            onClick={() => window.open('/hugin/ai-assistant', '_blank')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            title="Ouvrir Mímir complet"
          >
            <Settings size={16} style={{ color: 'white' }} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            title="Fermer"
          >
            <X size={16} style={{ color: 'white' }} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div
            ref={messagesContainerRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              scrollBehavior: 'smooth'
            }}
          >
            {messages.map(message => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '0.75rem 1rem',
                    borderRadius: '1rem',
                    background: message.role === 'user' 
                      ? 'linear-gradient(135deg, var(--accent-hugin), #818cf8)'
                      : 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    wordBreak: 'break-word'
                  }}
                >
                  {message.role === 'assistant' ? (
                    <div dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
                  ) : (
                    message.content
                  )}
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginTop: '0.25rem',
                    marginLeft: message.role === 'user' ? '0' : '0.5rem',
                    marginRight: message.role === 'user' ? '0.5rem' : '0'
                  }}
                >
                  {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-hugin)' }}>
                <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '0.9rem' }}>Mímir réfléchit...</span>
                <style>{`
                  @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(0, 0, 0, 0.2)'
            }}
          >
            {!hasApiKey && (
              <div style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '0.5rem', fontSize: '0.85rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Settings size={16} />
                <span>Configurez votre clé API dans le module Mímir</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question à Mímir..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.75rem',
                  color: 'white',
                  fontSize: '0.9rem',
                  resize: 'none',
                  minHeight: '44px',
                  maxHeight: '120px',
                  fontFamily: 'inherit'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                style={{
                  padding: '0.75rem 1rem',
                  background: inputMessage.trim() && !isLoading 
                    ? 'linear-gradient(135deg, var(--accent-hugin), #818cf8)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  opacity: inputMessage.trim() && !isLoading ? 1 : 0.5
                }}
                title="Envoyer (Entrée)"
              >
                <Send size={20} style={{ color: 'white' }} />
              </button>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.5rem', marginBottom: 0 }}>
              Entrée pour envoyer • Shift+Entrée pour nouvelle ligne
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default MimirFloatingButton;
