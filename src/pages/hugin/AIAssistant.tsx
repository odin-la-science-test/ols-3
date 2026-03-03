import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Settings, Trash2, Plus, Search, Bot, Sparkles, Code, FileText, Lightbulb } from 'lucide-react';
import { groqService } from '../../services/groqService';
import type { GroqMessage } from '../../services/groqService';

interface Conversation {
  id: string;
  name: string;
  timestamp: number;
  messageCount: number;
}

const AIAssistant = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<GroqMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<'llama-3.3-70b-versatile' | 'llama-3.1-70b-versatile' | 'mixtral-8x7b-32768' | 'openai/gpt-oss-120b'>('openai/gpt-oss-120b');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    const key = groqService.getApiKey();
    setApiKey(key);
    setTempApiKey(key);
    loadConversations();
    
    // Charger la conversation par défaut
    const saved = localStorage.getItem('mimir_current_conversation');
    if (saved) {
      const history = JSON.parse(saved);
      setMessages(history);
      groqService.setHistory(history);
    }
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
  }, []);

  // Auto-scroll uniquement si l'utilisateur n'a pas scrollé manuellement
  useEffect(() => {
    if (!isUserScrollingRef.current && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }, [messages]);

  const loadConversations = () => {
    const convs = groqService.listHistories();
    setConversations(convs);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Ajouter le message utilisateur
    const newMessages: GroqMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      // Prompt système pour Mímir
      const systemPrompt: GroqMessage = {
        role: 'system',
        content: `Tu es Mímir, le dieu nordique de la sagesse et de la connaissance. Tu es un assistant scientifique sage, patient et bienveillant.

Personnalité :
- Sage et réfléchi, tu prends le temps d'expliquer
- Bienveillant et encourageant envers la curiosité
- Scientifiquement rigoureux et précis
- Tu utilises parfois des métaphores nordiques (Yggdrasil, runes, etc.) pour clarifier
- Humble malgré ta grande connaissance

Ton rôle :
- Aider dans les recherches scientifiques
- Expliquer des concepts complexes de manière accessible
- Analyser des données et résultats
- Générer du code scientifique
- Conseiller sur les méthodologies
- Aider à la rédaction scientifique

Format de réponse :
- Utilise le Markdown pour formater tes réponses
- Pour les tableaux : utilise la syntaxe Markdown (| col1 | col2 |)
- Pour le code : utilise les blocs de code avec le langage (\`\`\`python)
- Pour les schémas : utilise du texte ASCII art ou des descriptions structurées
- Structure avec des titres (##), listes (-, *), gras (**), italique (*)
- IMPORTANT : N'utilise PAS Mermaid, préfère les tableaux ou le texte structuré

Réponds toujours en français, sauf si on te demande explicitement de traduire.`
      };

      // Préparer l'historique avec le prompt système
      const historyWithSystem = [systemPrompt, ...newMessages];
      
      // Limiter l'historique à 10 derniers messages pour éviter l'erreur 413
      const recentMessages = newMessages.slice(-10);
      groqService.setHistory(recentMessages);

      // Avertir si l'historique est tronqué
      if (newMessages.length > 10) {
        console.log(`📝 Historique limité aux 10 derniers messages (${newMessages.length} total)`);
      }

      let fullResponse = '';
      const assistantMessage: GroqMessage = { role: 'assistant', content: '' };
      setMessages([...newMessages, assistantMessage]);

      // Streaming avec historique limité
      const limitedHistory = [systemPrompt, ...recentMessages];
      for await (const chunk of groqService.sendMessageStream(userMessage, {
        model: selectedModel,
        temperature: 0.7,
        maxTokens: 8192,
        reasoningEffort: 'medium'
      })) {
        fullResponse += chunk;
        setMessages([...newMessages, { role: 'assistant', content: fullResponse }]);
      }

      // Sauvegarder la conversation
      const finalMessages = [...newMessages, { role: 'assistant', content: fullResponse }];
      localStorage.setItem('mimir_current_conversation', JSON.stringify(finalMessages));
      
    } catch (error: any) {
      console.error('Erreur:', error);
      setMessages([...newMessages, {
        role: 'assistant',
        content: `❌ Erreur: ${error.message}\n\nVérifie que ta clé API Groq est configurée dans les paramètres.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    groqService.setApiKey(tempApiKey);
    setApiKey(tempApiKey);
    setShowSettings(false);
  };

  const handleClearConversation = () => {
    if (confirm('Effacer toute la conversation ?')) {
      setMessages([]);
      groqService.clearHistory();
      localStorage.removeItem('mimir_current_conversation');
    }
  };

  const handleNewConversation = () => {
    if (messages.length > 0) {
      const name = prompt('Nom de la conversation ?') || `Conversation ${Date.now()}`;
      groqService.saveHistory(name);
      loadConversations();
    }
    setMessages([]);
    groqService.clearHistory();
    localStorage.removeItem('mimir_current_conversation');
    setCurrentConversationId('default');
  };

  const handleLoadConversation = (name: string) => {
    if (groqService.loadHistory(name)) {
      const history = groqService.getHistory();
      setMessages(history);
      setCurrentConversationId(name);
      localStorage.setItem('mimir_current_conversation', JSON.stringify(history));
    }
  };

  const handleDeleteConversation = (name: string) => {
    if (confirm(`Supprimer "${name}" ?`)) {
      groqService.deleteHistory(name);
      loadConversations();
      if (currentConversationId === name) {
        handleNewConversation();
      }
    }
  };

  const quickActions = [
    { icon: <Sparkles size={16} />, label: 'Analyser des données', prompt: 'Aide-moi à analyser ces données scientifiques : ' },
    { icon: <Code size={16} />, label: 'Générer du code', prompt: 'Génère un script Python pour : ' },
    { icon: <FileText size={16} />, label: 'Aide rédaction', prompt: 'Améliore ce texte scientifique : ' },
    { icon: <Lightbulb size={16} />, label: 'Expliquer concept', prompt: 'Explique-moi ce concept scientifique : ' }
  ];

  // Fonction pour formater le message avec support Markdown
  const formatMessage = (text: string): string => {
    let formatted = text;

    // Code blocks (traiter en premier pour éviter les conflits)
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const language = lang || 'text';
      const displayLang = language.toUpperCase();
      return `<div style="margin: 1rem 0;"><div style="background: var(--bg-secondary); padding: 0.5rem 1rem; border-radius: 0.5rem 0.5rem 0 0; font-size: 0.75rem; color: var(--text-secondary); border: 1px solid var(--border-color); border-bottom: none;">${displayLang}</div><pre style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-top: none; border-radius: 0 0 0.5rem 0.5rem; padding: 1rem; overflow-x: auto; margin: 0;"><code style="font-family: 'Courier New', monospace; font-size: 0.875rem; color: var(--text-primary); white-space: pre-wrap;">${code.trim()}</code></pre></div>`;
    });

    // Tables
    const tableRegex = /\|(.+)\|[\r\n]+\|[-:\s|]+\|[\r\n]+((?:\|.+\|[\r\n]*)+)/g;
    formatted = formatted.replace(tableRegex, (match) => {
      const lines = match.trim().split('\n');
      const headers = lines[0].split('|').filter(cell => cell.trim());
      const rows = lines.slice(2).map(line => 
        line.split('|').filter(cell => cell.trim())
      );

      let html = '<table style="border-collapse: collapse; width: 100%; margin: 1rem 0; border: 1px solid var(--border-color);">';
      html += '<thead><tr>';
      headers.forEach(header => {
        html += `<th style="border: 1px solid var(--border-color); padding: 0.75rem; background: var(--bg-secondary); text-align: left; font-weight: 600;">${header.trim()}</th>`;
      });
      html += '</tr></thead><tbody>';
      rows.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
          html += `<td style="border: 1px solid var(--border-color); padding: 0.75rem;">${cell.trim()}</td>`;
        });
        html += '</tr>';
      });
      html += '</tbody></table>';
      return html;
    });

    // Code blocks
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 0.5rem; padding: 1rem; overflow-x: auto; margin: 1rem 0;"><code style="font-family: 'Courier New', monospace; font-size: 0.875rem; color: var(--text-primary);">${code.trim()}</code></pre>`;
    });

    // Inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code style="background: var(--bg-secondary); padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-family: \'Courier New\', monospace; font-size: 0.875rem;">$1</code>');

    // Headers
    formatted = formatted.replace(/^### (.+)$/gm, '<h3 style="font-size: 1.125rem; font-weight: 600; margin: 1rem 0 0.5rem 0;">$1</h3>');
    formatted = formatted.replace(/^## (.+)$/gm, '<h2 style="font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.5rem 0;">$1</h2>');
    formatted = formatted.replace(/^# (.+)$/gm, '<h1 style="font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem 0;">$1</h1>');

    // Bold
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: 600;">$1</strong>');

    // Italic
    formatted = formatted.replace(/\*(.+?)\*/g, '<em style="font-style: italic;">$1</em>');

    // Lists
    formatted = formatted.replace(/^- (.+)$/gm, '<li style="margin-left: 1.5rem; margin-bottom: 0.25rem;">$1</li>');
    formatted = formatted.replace(/^(\d+)\. (.+)$/gm, '<li style="margin-left: 1.5rem; margin-bottom: 0.25rem; list-style-type: decimal;">$2</li>');

    // Quotes
    formatted = formatted.replace(/^> (.+)$/gm, '<blockquote style="border-left: 3px solid var(--accent-hugin); padding-left: 1rem; margin: 0.5rem 0; color: var(--text-secondary); font-style: italic;">$1</blockquote>');

    // Links
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--accent-hugin); text-decoration: underline;">$1</a>');

    return formatted;
  };

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div style={{
        width: '260px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header Sidebar */}
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <button
            onClick={handleNewConversation}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'var(--accent-hugin)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Plus size={18} />
            Nouvelle conversation
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              style={{
                width: '100%',
                padding: '0.5rem 0.5rem 0.5rem 2.25rem',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                color: 'var(--text-primary)',
                fontSize: '0.875rem'
              }}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
          {filteredConversations.map(conv => (
            <div
              key={conv.name}
              style={{
                padding: '0.75rem',
                marginBottom: '0.25rem',
                background: currentConversationId === conv.name ? 'var(--bg-primary)' : 'transparent',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onClick={() => handleLoadConversation(conv.name)}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.background = currentConversationId === conv.name ? 'var(--bg-primary)' : 'transparent'}
            >
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {conv.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                  {conv.messageCount} messages
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteConversation(conv.name);
                }}
                style={{
                  padding: '0.25rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  borderRadius: '0.25rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Model Selector */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
            Modèle
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as any)}
            style={{
              width: '100%',
              padding: '0.5rem',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '0.375rem',
              color: 'var(--text-primary)',
              fontSize: '0.875rem'
            }}
          >
            <option value="openai/gpt-oss-120b">GPT-OSS 120B</option>
            <option value="llama-3.3-70b-versatile">Llama 3.3 70B</option>
            <option value="llama-3.1-70b-versatile">Llama 3.1 70B</option>
            <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
          </select>
        </div>

        {/* Settings Button */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setShowSettings(true)}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '0.5rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Settings size={18} />
            Paramètres
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => navigate('/hugin')}
              style={{
                padding: '0.5rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <ArrowLeft size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Bot size={24} style={{ color: 'var(--accent-hugin)' }} />
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Mímir</h1>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Votre conseiller en sagesse scientifique
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleClearConversation}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '0.5rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.borderColor = '#ef4444';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
          >
            <Trash2 size={16} />
            Effacer
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={messagesContainerRef}
          style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}
        >
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Bot size={64} style={{ color: 'var(--accent-hugin)', marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Bienvenue, chercheur</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Je suis Mímir, ton conseiller scientifique. Pose-moi tes questions.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', maxWidth: '800px', margin: '0 auto' }}>
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(action.prompt)}
                    style={{
                      padding: '1rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-hugin)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ color: 'var(--accent-hugin)' }}>{action.icon}</div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: msg.role === 'user' ? 'var(--accent-hugin)' : 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: msg.role === 'assistant' ? '1px solid var(--border-color)' : 'none'
              }}>
                {msg.role === 'user' ? (
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>U</span>
                ) : (
                  <Bot size={18} style={{ color: 'var(--accent-hugin)' }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  {msg.role === 'user' ? 'Vous' : 'Mímir'}
                </div>
                <div 
                  style={{
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    color: 'var(--text-primary)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-color)'
              }}>
                <Bot size={18} style={{ color: 'var(--accent-hugin)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Mímir
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-hugin)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-hugin)', animation: 'pulse 1.5s ease-in-out 0.2s infinite' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-hugin)', animation: 'pulse 1.5s ease-in-out 0.4s infinite' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ position: 'relative' }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Pose ta question à Mímir..."
                style={{
                  width: '100%',
                  minHeight: '56px',
                  maxHeight: '200px',
                  padding: '1rem 3.5rem 1rem 1rem',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.75rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.9375rem',
                  resize: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  bottom: '0.75rem',
                  padding: '0.5rem',
                  background: input.trim() && !isLoading ? 'var(--accent-hugin)' : 'var(--bg-secondary)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: 'white',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  opacity: input.trim() && !isLoading ? 1 : 0.5
                }}
              >
                <Send size={18} />
              </button>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              {apiKey ? 'Appuie sur Entrée pour envoyer, Shift+Entrée pour nouvelle ligne' : '⚠️ Configure ta clé API dans les paramètres'}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }} onClick={() => setShowSettings(false)}>
          <div
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: '1rem',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              border: '1px solid var(--border-color)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Settings size={24} style={{ color: 'var(--accent-hugin)' }} />
              Configuration
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                Clé API Groq
              </label>
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="gsk_..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.5rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.9375rem'
                }}
              />
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Obtiens une clé gratuite sur <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-hugin)' }}>console.groq.com</a>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleSaveApiKey}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'var(--accent-hugin)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Sauvegarder
              </button>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.5rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AIAssistant;
