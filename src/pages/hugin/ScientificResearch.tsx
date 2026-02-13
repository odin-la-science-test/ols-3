import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Book, Brain, ChevronLeft, Trash2, Download,
    Check, Copy, Archive, Folder,
    Plus, X, RefreshCw, Moon, Sun,
    LayoutGrid, List, FileText, ExternalLink
} from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import { fetchModuleData, saveModuleItem, deleteModuleItem } from '../../utils/persistence';

interface Article {
    id?: string;
    title: string;
    abstract: string;
    year: string;
    authors: string;
    doi: string;
    source: string;
    sourceUrl: string;
    url: string;
    pdfUrl: string | null;
    dateAdded?: string;
    folderId?: string;
    autoArchived?: boolean;
    sources?: string[];
    sourceUrls?: string[];
}

interface FolderType {
    id: string;
    name: string;
    icon: string;
    createdAt: string;
}

interface WatchItem {
    type: 'author' | 'keyword' | 'orcid';
    value: string;
}

const ScientificResearch = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const [view, setView] = useState<'home' | 'research' | 'publications'>('home');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState<'keywords' | 'exact' | 'author'>('keywords');
    const [yearMin, setYearMin] = useState('');
    const [yearMax, setYearMax] = useState('');
    const [activeSources, setActiveSources] = useState<string[]>(['pubmed', 'europepmc', 'arxiv', 'crossref', 'semantic', 'openalex', 'hal', 'scholar']);

    const [results, setResults] = useState<Article[]>([]);
    const [archives, setArchives] = useState<Article[]>([]);
    const [folders, setFolders] = useState<FolderType[]>([]);
    const [currentFolder, setCurrentFolder] = useState<string>('all');

    const [watchList, setWatchList] = useState<WatchItem[]>([]);
    const [showAutoWatchModal, setShowAutoWatchModal] = useState(false);
    const [watchType, setWatchType] = useState<'author' | 'keyword' | 'orcid'>('author');
    const [watchInput, setWatchInput] = useState('');

    useEffect(() => {
        const loadSavedData = async () => {
            const [savedArchives, savedFolders, savedWatchList] = await Promise.all([
                fetchModuleData('research_archives'),
                fetchModuleData('research_folders'),
                fetchModuleData('research_watchlist')
            ]);
            if (savedArchives) setArchives(savedArchives);
            if (savedFolders) setFolders(savedFolders);
            if (savedWatchList) setWatchList(savedWatchList);
        };
        loadSavedData();
    }, []);

    const saveArchives = async (data: Article[]) => {
        setArchives(data);

    };

    const isArchived = (article: Article) => {
        return archives.some(a => {
            if (article.doi && a.doi) return article.doi === a.doi;
            return article.title === a.title;
        });
    };

    const notify = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
        showToast(msg, type);
    };


    const searchPubMed = async (query: string, limit = 50) => {
        try {
            const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${limit}&retmode=json`;
            const searchRes = await fetch(searchUrl);
            const searchData = await searchRes.json();
            const idList = searchData.esearchresult?.idlist || [];
            if (idList.length === 0) return [];

            const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${idList.join(',')}&retmode=xml`;
            const fetchRes = await fetch(fetchUrl);
            const xmlText = await fetchRes.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlText, 'text/xml');
            const articlesXml = xml.querySelectorAll('PubmedArticle');

            const results: Article[] = [];
            articlesXml.forEach(art => {
                const title = art.querySelector('ArticleTitle')?.textContent || 'Untitled';
                const abstract = art.querySelector('AbstractText')?.textContent || 'No abstract available';
                const year = art.querySelector('PubDate Year')?.textContent || '';
                const pmid = art.querySelector('PMID')?.textContent || '';
                const doi = art.querySelector('ArticleId[IdType="doi"]')?.textContent || '';
                const authors: string[] = [];
                art.querySelectorAll('Author').forEach(au => {
                    const fn = au.querySelector('ForeName')?.textContent || '';
                    const ln = au.querySelector('LastName')?.textContent || '';
                    if (fn || ln) authors.push(`${fn} ${ln}`.trim());
                });
                results.push({
                    title,
                    abstract: abstract.substring(0, 300),
                    year,
                    authors: authors.slice(0, 3).join(', ') + (authors.length > 3 ? ' et al.' : ''),
                    doi: doi || `PMID:${pmid}`,
                    source: 'PubMed',
                    sourceUrl: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
                    url: `https://doi.org/${doi}`,
                    pdfUrl: doi ? `https://doi.org/${doi}` : null
                });
            });
            return results;
        } catch (e) {
            console.error('PubMed error:', e);
            return [];
        }
    };

    const searchArXiv = async (query: string, limit = 50) => {
        try {
            const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=${limit}`;
            const res = await fetch(url);
            const xmlText = await res.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlText, 'text/xml');
            const entries = xml.querySelectorAll('entry');
            const results: Article[] = [];
            entries.forEach(entry => {
                const title = entry.querySelector('title')?.textContent?.trim() || 'Untitled';
                const abstract = entry.querySelector('summary')?.textContent?.trim() || 'No abstract available';
                const published = entry.querySelector('published')?.textContent || '';
                const year = published ? new Date(published).getFullYear().toString() : '';
                const id = entry.querySelector('id')?.textContent || '';
                const arxivId = id.split('/abs/').pop() || '';
                const authors: string[] = [];
                entry.querySelectorAll('author name').forEach(a => {
                    const name = a.textContent?.trim();
                    if (name) authors.push(name);
                });
                results.push({
                    title,
                    abstract: abstract.substring(0, 300),
                    year,
                    authors: authors.slice(0, 3).join(', ') + (authors.length > 3 ? ' et al.' : ''),
                    doi: arxivId,
                    source: 'arXiv',
                    sourceUrl: `https://arxiv.org/abs/${arxivId}`,
                    url: `https://arxiv.org/abs/${arxivId}`,
                    pdfUrl: `https://arxiv.org/pdf/${arxivId}.pdf`
                });
            });
            return results;
        } catch (e) {
            console.error('arXiv error:', e);
            return [];
        }
    };

    const searchCrossRef = async (query: string, limit = 50) => {
        try {
            const url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=${limit}`;
            const res = await fetch(url);
            const data = await res.json();
            const items = data.message?.items || [];
            return items.map((item: any) => {
                const authors: string[] = [];
                if (item.author) {
                    item.author.slice(0, 3).forEach((a: any) => {
                        const name = `${a.given || ''} ${a.family || ''}`.trim();
                        if (name) authors.push(name);
                    });
                }
                return {
                    title: item.title?.[0] || 'Untitled',
                    abstract: (item.abstract || 'No abstract available').substring(0, 300),
                    year: item.published?.['date-parts']?.[0]?.[0]?.toString() || '',
                    authors: authors.join(', ') + (item.author?.length > 3 ? ' et al.' : ''),
                    doi: item.DOI || '',
                    source: 'CrossRef',
                    sourceUrl: item.DOI ? `https://doi.org/${item.DOI}` : '',
                    url: item.DOI ? `https://doi.org/${item.DOI}` : '',
                    pdfUrl: item.DOI ? `https://doi.org/${item.DOI}` : null
                };
            });
        } catch (e) {
            console.error('CrossRef error:', e);
            return [];
        }
    };

    const deduplicateAndMerge = (allResults: Article[]) => {
        const articlesMap = new Map<string, Article>();
        allResults.forEach(article => {
            let key = '';
            if (article.doi && article.doi.trim()) {
                key = 'doi:' + article.doi.trim().toLowerCase();
            } else if (article.title) {
                const normalizedTitle = article.title
                    .toLowerCase()
                    .replace(/[^\w\s]/g, '')
                    .replace(/\s+/g, ' ')
                    .trim();
                key = 'title:' + normalizedTitle;
            }
            if (!key) return;

            if (articlesMap.has(key)) {
                const existing = articlesMap.get(key)!;
                if (!existing.sources) {
                    existing.sources = [existing.source];
                    existing.sourceUrls = [existing.sourceUrl || existing.url];
                }
                if (!existing.sources.includes(article.source)) {
                    existing.sources.push(article.source);
                    existing.sourceUrls?.push(article.sourceUrl || article.url);
                }
                if (!existing.abstract || existing.abstract.length < (article.abstract?.length || 0)) {
                    existing.abstract = article.abstract;
                }
                if (!existing.pdfUrl && article.pdfUrl) {
                    existing.pdfUrl = article.pdfUrl;
                }
            } else {
                articlesMap.set(key, { ...article });
            }
        });
        return Array.from(articlesMap.values());
    };

    const performSearch = async () => {
        if (!searchQuery.trim()) {
            notify('Please enter search terms', 'error');
            return;
        }
        setIsSearching(true);

        try {
            const promises: Promise<Article[]>[] = [];
            if (activeSources.includes('pubmed')) promises.push(searchPubMed(searchQuery));
            if (activeSources.includes('arxiv')) promises.push(searchArXiv(searchQuery));
            if (activeSources.includes('crossref')) promises.push(searchCrossRef(searchQuery));


            const resultsData = await Promise.all(promises);
            let merged = deduplicateAndMerge(resultsData.flat());

            if (searchType === 'exact') {
                merged = merged.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));
            } else if (searchType === 'author') {
                merged = merged.filter(r => r.authors.toLowerCase().includes(searchQuery.toLowerCase()));
            }

            const min = parseInt(yearMin);
            const max = parseInt(yearMax);
            if (min || max) {
                merged = merged.filter(r => {
                    const y = parseInt(r.year);
                    if (!y) return true;
                    if (min && y < min) return false;
                    if (max && y > max) return false;
                    return true;
                });
            }

            setResults(merged);
            if (merged.length === 0) {
                notify('No results found', 'info');
            } else {
                notify(`${merged.length} results found`, 'success');
            }
        } catch (e) {
            console.error('Search error:', e);
            notify('Error during search', 'error');
        } finally {
            setIsSearching(false);
        }
    };

    const archiveArticle = async (article: Article, folderId = 'uncategorized') => {
        if (isArchived(article)) {
            notify('Already archived', 'info');
            return;
        }
        const newArchive = {
            ...article,
            id: article.doi || article.title, // Ensure id exists
            dateAdded: new Date().toISOString(),
            folderId
        };
        try {
            await saveModuleItem('research_archives', newArchive);
            setArchives([newArchive, ...archives]);
            notify('Added to library', 'success');
        } catch (e) {
            notify('Error archiving article', 'error');
        }
    };

    const addFolder = async (name: string) => {
        const newFolder: FolderType = {
            id: generateId(),
            name,
            icon: 'folder',
            createdAt: new Date().toISOString()
        };
        try {
            await saveModuleItem('research_folders', newFolder);
            setFolders([...folders, newFolder]);
            notify('Dossier créé', 'success');
        } catch (e) {
            notify('Erreur de création du dossier', 'error');
        }
    };

    const removeFolder = async (id: string) => {
        try {
            await deleteModuleItem('research_folders', id);
            setFolders(folders.filter(f => f.id !== id));
            setArchives(archives.map(a => a.folderId === id ? { ...a, folderId: 'uncategorized' } : a));
            notify('Dossier supprimé', 'info');
        } catch (e) {
            notify('Erreur de suppression du dossier', 'error');
        }
    };

    const addToWatchList = async (item: WatchItem) => {
        try {
            const id = `${item.type}-${item.value}`;
            await saveModuleItem('research_watchlist', { ...item, id });
            setWatchList([...watchList, item]);
            notify('Veille activée', 'success');
        } catch (e) {
            notify('Erreur d\'activation de la veille', 'error');
        }
    };

    const removeArchive = async (article: Article) => {
        try {
            const id = article.id || article.doi || article.title;
            await deleteModuleItem('research_archives', id);
            setArchives(archives.filter(a => (a.id || a.doi || a.title) !== id));
            notify('Removed from library', 'info');
        } catch (e) {
            notify('Error removing from library', 'error');
        }
    };

    const copyDOI = (doi: string) => {
        navigator.clipboard.writeText(doi);
        notify('DOI copied', 'success');
    };


    return (
        <div style={{
            minHeight: '100vh',
            background: isDarkMode ? 'var(--bg-primary)' : '#f8fafc',
            color: isDarkMode ? 'white' : '#1e293b',
            transition: 'all 0.3s'
        }}>
            {/* Header */}
            <header className="glass-panel" style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button
                        onClick={() => view === 'home' ? navigate('/hugin') : setView('home')}
                        style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.5rem', borderRadius: '0.5rem', color: 'inherit', border: 'none', cursor: 'pointer' }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Brain size={28} color="var(--accent-hugin)" />
                        Scientific Research
                    </h1>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                        onClick={() => setView('research')}
                        className={`btn-nav ${view === 'research' ? 'active' : ''}`}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            background: view === 'research' ? 'var(--accent-hugin)' : 'transparent',
                            color: view === 'research' ? 'white' : 'inherit',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Search size={18} /> Research
                    </button>
                    <button
                        onClick={() => setView('publications')}
                        className={`btn-nav ${view === 'publications' ? 'active' : ''}`}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            background: view === 'publications' ? 'var(--accent-hugin)' : 'transparent',
                            color: view === 'publications' ? 'white' : 'inherit',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Book size={18} /> Publications
                    </button>
                    <button
                        onClick={() => setShowAutoWatchModal(true)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            background: 'linear-gradient(135deg, #fa709a, #fee140)',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 600
                        }}
                    >
                        <RefreshCw size={18} /> Auto-Watch
                    </button>
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.5rem', borderRadius: '50%', color: 'inherit', border: 'none', cursor: 'pointer' }}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </header>

            <main className="container" style={{ padding: '2rem' }}>
                {view === 'home' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '2rem', animation: 'float 3s infinite ease-in-out' }}>🔬</div>
                        <h2 className="text-gradient" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Multi-Source Scientific Lookup</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '3rem' }}>
                            Explore millions of scientific publications from PubMed, arXiv, CrossRef, Semantic Scholar, and more, all from a single secure workspace.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', width: '100%', maxWidth: '900px' }}>
                            <div
                                className="card glass-panel h-full"
                                onClick={() => setView('research')}
                                style={{ padding: '3rem', cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s' }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-hugin)'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🔎</div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Active Research</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Launch complex queries across global biological and technical databases.</p>
                            </div>
                            <div
                                className="card glass-panel h-full"
                                onClick={() => setView('publications')}
                                style={{ padding: '3rem', cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s' }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10b981'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📚</div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>My Library</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Manage your personal collection of articles, patents, and technical documentation.</p>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'research' && (
                    <div>
                        <div className="card glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                                        placeholder="Enter keywords, DOI, or author names..."
                                        style={{
                                            width: '100%',
                                            padding: '1rem 1rem 1rem 3rem',
                                            paddingLeft: '3.5rem',
                                            borderRadius: '1rem',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '2px solid rgba(255, 255, 255, 0.1)',
                                            color: 'inherit',
                                            fontSize: '1.1rem'
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={performSearch}
                                    disabled={isSearching}
                                    style={{
                                        padding: '0 2rem',
                                        borderRadius: '1rem',
                                        background: 'var(--accent-hugin)',
                                        color: 'white',
                                        border: 'none',
                                        fontWeight: 600,
                                        cursor: isSearching ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {isSearching ? 'Searching...' : 'Search'}
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                <div className="filter-group">
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Search Type</label>
                                    <select
                                        value={searchType}
                                        onChange={(e) => setSearchType(e.target.value as any)}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'inherit' }}
                                    >
                                        <option value="keywords">Keywords</option>
                                        <option value="exact">Exact Match</option>
                                        <option value="author">Author Search</option>
                                    </select>
                                </div>
                                <div className="filter-group">
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Year Range</label>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <input
                                            type="number"
                                            value={yearMin}
                                            onChange={(e) => setYearMin(e.target.value)}
                                            placeholder="Min"
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'inherit' }}
                                        />
                                        <span>-</span>
                                        <input
                                            type="number"
                                            value={yearMax}
                                            onChange={(e) => setYearMax(e.target.value)}
                                            placeholder="Max"
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'inherit' }}
                                        />
                                    </div>
                                </div>
                                <div className="filter-group" style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'block' }}>Active Sources</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                        {['pubmed', 'arxiv', 'crossref', 'europepmc', 'semantic', 'openalex', 'hal', 'scholar'].map(src => (
                                            <button
                                                key={src}
                                                onClick={() => {
                                                    if (activeSources.includes(src)) {
                                                        setActiveSources(activeSources.filter(s => s !== src));
                                                    } else {
                                                        setActiveSources([...activeSources, src]);
                                                    }
                                                }}
                                                style={{
                                                    padding: '0.4rem 0.8rem',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.75rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    background: activeSources.includes(src) ? 'var(--accent-hugin)' : 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    color: activeSources.includes(src) ? 'white' : 'inherit',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {src}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                            <div className="card glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-hugin)' }}>{results.length}</div>
                                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Total Results</div>
                            </div>
                            <div className="card glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>{results.filter(r => r.pdfUrl).length}</div>
                                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>PDFs Found</div>
                            </div>
                            <div className="card glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#6366f1' }}>{archives.length}</div>
                                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Library Items</div>
                            </div>
                        </div>

                        {/* Search Results */}
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {results.length === 0 && !isSearching && (
                                <div className="card glass-panel" style={{ padding: '5rem', textAlign: 'center', opacity: 0.5 }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔎</div>
                                    <p>Enter search terms to begin exploring catalogs</p>
                                </div>
                            )}

                            {results.map((article, idx) => (
                                <div key={idx} className={`card glass-panel ${isArchived(article) ? 'archived' : ''}`} style={{
                                    borderLeft: isArchived(article) ? '4px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                                    padding: '1.5rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1.5rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{article.title}</h3>
                                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                                <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#a5b4fc' }}>📅 {article.year || 'N/A'}</span>
                                                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7' }}>📚 {article.source}</span>
                                                {article.sources && article.sources.length > 1 && (
                                                    <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#f9a8d4' }}>🔗 Found in {article.sources.length} sources</span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                                <strong>Authors:</strong> {article.authors}
                                            </div>
                                            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.8, marginBottom: '1.5rem' }}>
                                                {article.abstract}...
                                            </p>
                                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                                <a href={article.url} target="_blank" rel="noreferrer" className="btn btn-small" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.1)' }}>
                                                    <ExternalLink size={14} /> Open Result
                                                </a>
                                                {article.pdfUrl && (
                                                    <button onClick={() => window.open(article.pdfUrl!, '_blank')} className="btn btn-small" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' }}>
                                                        <Download size={14} /> View PDF
                                                    </button>
                                                )}
                                                {article.doi && (
                                                    <button onClick={() => copyDOI(article.doi)} className="btn btn-small" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                                                        <Copy size={14} /> Copy DOI
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => archiveArticle(article)}
                                            disabled={isArchived(article)}
                                            style={{
                                                padding: '1rem',
                                                borderRadius: '0.75rem',
                                                background: isArchived(article) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                                color: isArchived(article) ? '#10b981' : 'var(--accent-hugin)',
                                                border: 'none',
                                                cursor: isArchived(article) ? 'default' : 'pointer'
                                            }}
                                        >
                                            {isArchived(article) ? <Check size={24} /> : <Archive size={24} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'publications' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
                        {/* Library Sidebar */}
                        <aside>
                            <div className="card glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Folders</h3>
                                    <button
                                        onClick={() => {
                                            const name = prompt('Folder name:');
                                            if (name) {
                                                addFolder(name);
                                            }
                                        }}
                                        style={{ background: 'none', border: 'none', color: 'var(--accent-hugin)', cursor: 'pointer' }}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => setCurrentFolder('all')}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem',
                                            background: currentFolder === 'all' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                            color: currentFolder === 'all' ? 'var(--accent-hugin)' : 'inherit',
                                            border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%'
                                        }}
                                    >
                                        <LayoutGrid size={18} /> All Items ({archives.length})
                                    </button>
                                    <button
                                        onClick={() => setCurrentFolder('uncategorized')}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem',
                                            background: currentFolder === 'uncategorized' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                            color: currentFolder === 'uncategorized' ? 'var(--accent-hugin)' : 'inherit',
                                            border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%'
                                        }}
                                    >
                                        <List size={18} /> Uncategorized ({archives.filter(a => !a.folderId || a.folderId === 'uncategorized').length})
                                    </button>
                                    <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '0.5rem 0' }} />
                                    {folders.map(f => (
                                        <div key={f.id} style={{ position: 'relative', display: 'flex' }}>
                                            <button
                                                onClick={() => setCurrentFolder(f.id)}
                                                style={{
                                                    flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem',
                                                    background: currentFolder === f.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                                    color: currentFolder === f.id ? 'var(--accent-hugin)' : 'inherit',
                                                    border: 'none', cursor: 'pointer', textAlign: 'left'
                                                }}
                                            >
                                                <Folder size={18} /> {f.name}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeFolder(f.id); }}
                                                style={{ padding: '0.5rem', opacity: 0.3, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Library Content */}
                        <div>
                            <div className="card glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                                    {currentFolder === 'all' ? 'All Publications' : folders.find(f => f.id === currentFolder)?.name || 'Uncategorized'}
                                </h2>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Filter library..."
                                        style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'inherit' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                                {archives
                                    .filter(a => currentFolder === 'all' || (currentFolder === 'uncategorized' ? (!a.folderId || a.folderId === 'uncategorized') : a.folderId === currentFolder))
                                    .map((article, idx) => (
                                        <div key={idx} className="card glass-panel" style={{ padding: '1.25rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.4 }}>{article.title}</h4>
                                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{article.source}</span>
                                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>•</span>
                                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{article.year}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeArchive(article)}
                                                    style={{ background: 'none', border: 'none', color: '#ef4444', opacity: 0.6, cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                <button className="btn btn-small" onClick={() => window.open(article.url, '_blank')} style={{ background: 'rgba(255, 255, 255, 0.05)', flex: 1 }}>
                                                    <ExternalLink size={14} /> View
                                                </button>
                                                {article.pdfUrl && (
                                                    <button className="btn btn-small" onClick={() => window.open(article.pdfUrl!, '_blank')} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', flex: 1 }}>
                                                        <FileText size={14} /> PDF
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Auto Watch Modal (Simplified) */}
            {showAutoWatchModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(5px)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div className="card glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fa709a' }}>
                                <Brain size={24} /> Automated Library Watch
                            </h2>
                            <button onClick={() => setShowAutoWatchModal(false)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Add New Watch</h3>
                            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                                <select
                                    value={watchType}
                                    onChange={(e) => setWatchType(e.target.value as any)}
                                    style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'inherit' }}
                                >
                                    <option value="author">Author</option>
                                    <option value="keyword">Keyword</option>
                                    <option value="orcid">ORCID</option>
                                </select>
                                <input
                                    type="text"
                                    value={watchInput}
                                    onChange={(e) => setWatchInput(e.target.value)}
                                    placeholder="e.g. Marie Curie"
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'inherit' }}
                                />
                                <button
                                    onClick={() => {
                                        if (watchInput.trim()) {
                                            setWatchList([...watchList, { type: watchType, value: watchInput.trim() }]);
                                            setWatchInput('');
                                            showToast('Watch added', 'success');
                                        }
                                    }}
                                    style={{
                                        padding: '0 1.5rem', borderRadius: '0.75rem', background: 'var(--accent-hugin)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer'
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Active Watches ({watchList.length})</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                                {watchList.map((watch, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '0.75rem' }}>
                                        <div>
                                            <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.3rem', textTransform: 'uppercase', marginRight: '0.75rem' }}>{watch.type}</span>
                                            <span style={{ fontWeight: 600 }}>{watch.value}</span>
                                        </div>
                                        <button
                                            onClick={() => setWatchList(watchList.filter((_, idx) => idx !== i))}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                            <button
                                style={{
                                    flex: 1, padding: '1rem', borderRadius: '1rem', background: 'linear-gradient(135deg, #00c6ff, #0072ff)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer'
                                }}
                                onClick={() => {
                                    notify('Feature coming soon in full version');
                                }}
                            >
                                Check Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScientificResearch;
