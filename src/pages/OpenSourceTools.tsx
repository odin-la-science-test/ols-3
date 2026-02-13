import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Download, Star, Code } from 'lucide-react';

const OpenSourceTools = () => {
    const navigate = useNavigate();

    const categories = [
        {
            name: 'Analyse de Séquences',
            tools: [
                {
                    name: 'BLAST',
                    description: 'Outil de recherche d\'alignement de séquences biologiques',
                    license: 'Public Domain',
                    url: 'https://blast.ncbi.nlm.nih.gov/',
                    github: 'https://github.com/ncbi/blast_plus_docs',
                    language: 'C++',
                    features: ['Alignement de séquences', 'Recherche de similarité', 'Base de données NCBI']
                },
                {
                    name: 'Biopython',
                    description: 'Bibliothèque Python pour la bioinformatique',
                    license: 'BSD',
                    url: 'https://biopython.org/',
                    github: 'https://github.com/biopython/biopython',
                    language: 'Python',
                    features: ['Manipulation de séquences', 'Parsers de fichiers', 'Accès aux bases de données']
                },
                {
                    name: 'EMBOSS',
                    description: 'Suite d\'outils pour l\'analyse de séquences',
                    license: 'GPL',
                    url: 'http://emboss.sourceforge.net/',
                    github: 'https://github.com/kimrutherford/EMBOSS',
                    language: 'C',
                    features: ['200+ programmes', 'Analyse de séquences', 'Prédiction de structure']
                }
            ]
        },
        {
            name: 'Phylogénie',
            tools: [
                {
                    name: 'MEGA',
                    description: 'Molecular Evolutionary Genetics Analysis',
                    license: 'Proprietary (Free)',
                    url: 'https://www.megasoftware.net/',
                    github: null,
                    language: 'C++',
                    features: ['Arbres phylogénétiques', 'Analyse évolutive', 'Interface graphique']
                },
                {
                    name: 'IQ-TREE',
                    description: 'Inférence phylogénétique par maximum de vraisemblance',
                    license: 'GPL',
                    url: 'http://www.iqtree.org/',
                    github: 'https://github.com/iqtree/iqtree2',
                    language: 'C++',
                    features: ['Maximum de vraisemblance', 'Bootstrap ultrarapide', 'Sélection de modèles']
                },
                {
                    name: 'FigTree',
                    description: 'Visualisation d\'arbres phylogénétiques',
                    license: 'GPL',
                    url: 'http://tree.bio.ed.ac.uk/software/figtree/',
                    github: 'https://github.com/rambaut/figtree',
                    language: 'Java',
                    features: ['Visualisation interactive', 'Export haute qualité', 'Annotation d\'arbres']
                }
            ]
        },
        {
            name: 'Microbiologie',
            tools: [
                {
                    name: 'QIIME 2',
                    description: 'Analyse de données de microbiome',
                    license: 'BSD',
                    url: 'https://qiime2.org/',
                    github: 'https://github.com/qiime2/qiime2',
                    language: 'Python',
                    features: ['Analyse de diversité', 'Taxonomie', 'Visualisations interactives']
                },
                {
                    name: 'mothur',
                    description: 'Analyse de séquences microbiennes',
                    license: 'GPL',
                    url: 'https://mothur.org/',
                    github: 'https://github.com/mothur/mothur',
                    language: 'C++',
                    features: ['OTU clustering', 'Analyse de diversité', 'Classification taxonomique']
                },
                {
                    name: 'BioNumerics',
                    description: 'Analyse de données microbiologiques',
                    license: 'Commercial (Trial)',
                    url: 'https://www.applied-maths.com/bionumerics',
                    github: null,
                    language: 'Multiple',
                    features: ['Typage moléculaire', 'Épidémiologie', 'Base de données']
                }
            ]
        },
        {
            name: 'Génomique',
            tools: [
                {
                    name: 'IGV',
                    description: 'Integrative Genomics Viewer',
                    license: 'MIT',
                    url: 'https://igv.org/',
                    github: 'https://github.com/igvteam/igv',
                    language: 'Java',
                    features: ['Visualisation de génomes', 'Support multi-formats', 'Annotations']
                },
                {
                    name: 'Artemis',
                    description: 'Visualisation et annotation de génomes',
                    license: 'GPL',
                    url: 'https://www.sanger.ac.uk/tool/artemis/',
                    github: 'https://github.com/sanger-pathogens/Artemis',
                    language: 'Java',
                    features: ['Annotation de gènes', 'Visualisation', 'Édition de séquences']
                },
                {
                    name: 'SPAdes',
                    description: 'Assemblage de génomes',
                    license: 'GPL',
                    url: 'https://cab.spbu.ru/software/spades/',
                    github: 'https://github.com/ablab/spades',
                    language: 'C++',
                    features: ['Assemblage de novo', 'Métagénomique', 'Plasmides']
                }
            ]
        },
        {
            name: 'Statistiques & Visualisation',
            tools: [
                {
                    name: 'R',
                    description: 'Langage pour l\'analyse statistique',
                    license: 'GPL',
                    url: 'https://www.r-project.org/',
                    github: 'https://github.com/wch/r-source',
                    language: 'R',
                    features: ['Statistiques avancées', 'Graphiques', '20000+ packages']
                },
                {
                    name: 'RStudio',
                    description: 'IDE pour R',
                    license: 'AGPL',
                    url: 'https://posit.co/products/open-source/rstudio/',
                    github: 'https://github.com/rstudio/rstudio',
                    language: 'C++/JavaScript',
                    features: ['Interface intuitive', 'Débogage', 'Gestion de projets']
                },
                {
                    name: 'GraphPad Prism (Alternative: SciDAVis)',
                    description: 'Analyse et graphiques scientifiques',
                    license: 'GPL',
                    url: 'https://scidavis.sourceforge.net/',
                    github: 'https://github.com/SciDAVis/scidavis',
                    language: 'C++',
                    features: ['Graphiques publication', 'Statistiques', 'Analyse de données']
                }
            ]
        },
        {
            name: 'Gestion de Laboratoire',
            tools: [
                {
                    name: 'OpenBIS',
                    description: 'Système d\'information pour laboratoires',
                    license: 'Apache 2.0',
                    url: 'https://openbis.ch/',
                    github: 'https://github.com/empa-scientific-it/openbis',
                    language: 'Java',
                    features: ['Gestion d\'échantillons', 'Traçabilité', 'Workflows']
                },
                {
                    name: 'LabKey Server',
                    description: 'Plateforme de gestion de données scientifiques',
                    license: 'Apache 2.0',
                    url: 'https://www.labkey.org/',
                    github: 'https://github.com/LabKey/labkey-api-java',
                    language: 'Java',
                    features: ['Gestion de données', 'Collaboration', 'Intégrations']
                },
                {
                    name: 'eLabFTW',
                    description: 'Cahier de laboratoire électronique',
                    license: 'AGPL',
                    url: 'https://www.elabftw.net/',
                    github: 'https://github.com/elabftw/elabftw',
                    language: 'PHP',
                    features: ['Cahier de labo', 'Gestion d\'inventaire', 'Collaboration']
                }
            ]
        },
        {
            name: 'Imagerie & Microscopie',
            tools: [
                {
                    name: 'ImageJ/Fiji',
                    description: 'Traitement et analyse d\'images scientifiques',
                    license: 'Public Domain',
                    url: 'https://imagej.net/software/fiji/',
                    github: 'https://github.com/fiji/fiji',
                    language: 'Java',
                    features: ['Analyse d\'images', '500+ plugins', 'Macros']
                },
                {
                    name: 'CellProfiler',
                    description: 'Analyse d\'images de cellules',
                    license: 'BSD',
                    url: 'https://cellprofiler.org/',
                    github: 'https://github.com/CellProfiler/CellProfiler',
                    language: 'Python',
                    features: ['Segmentation', 'Comptage de cellules', 'Pipelines']
                },
                {
                    name: 'QuPath',
                    description: 'Analyse d\'images biomédicales',
                    license: 'GPL',
                    url: 'https://qupath.github.io/',
                    github: 'https://github.com/qupath/qupath',
                    language: 'Java',
                    features: ['Pathologie digitale', 'Machine learning', 'Annotations']
                }
            ]
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#f8fafc',
            padding: '2rem'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/hugin')}
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
                    <Code size={60} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 900,
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Logiciels Open Source
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#94a3b8' }}>
                        Outils scientifiques libres et gratuits pour la recherche
                    </p>
                </div>

                {categories.map((category, catIndex) => (
                    <div key={catIndex} style={{ marginBottom: '3rem' }}>
                        <h2 style={{
                            fontSize: '1.75rem',
                            fontWeight: 700,
                            marginBottom: '1.5rem',
                            color: '#3b82f6',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <Star size={24} />
                            {category.name}
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                            gap: '1.5rem'
                        }}>
                            {category.tools.map((tool, toolIndex) => (
                                <div
                                    key={toolIndex}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '1rem',
                                        padding: '1.5rem',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.borderColor = '#3b82f6';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    }}
                                >
                                    <div style={{ marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                            {tool.name}
                                        </h3>
                                        <div style={{
                                            display: 'flex',
                                            gap: '0.5rem',
                                            marginBottom: '0.75rem',
                                            flexWrap: 'wrap'
                                        }}>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                padding: '0.25rem 0.5rem',
                                                background: 'rgba(34, 197, 94, 0.2)',
                                                color: '#22c55e',
                                                borderRadius: '0.25rem',
                                                fontWeight: 600
                                            }}>
                                                {tool.license}
                                            </span>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                padding: '0.25rem 0.5rem',
                                                background: 'rgba(59, 130, 246, 0.2)',
                                                color: '#3b82f6',
                                                borderRadius: '0.25rem'
                                            }}>
                                                {tool.language}
                                            </span>
                                        </div>
                                        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                            {tool.description}
                                        </p>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#94a3b8' }}>
                                            Fonctionnalités:
                                        </h4>
                                        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.85rem' }}>
                                            {tool.features.map((feature, i) => (
                                                <li key={i} style={{ marginBottom: '0.25rem' }}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <a
                                            href={tool.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.5rem 1rem',
                                                background: 'rgba(59, 130, 246, 0.2)',
                                                border: '1px solid #3b82f6',
                                                borderRadius: '0.5rem',
                                                color: '#3b82f6',
                                                textDecoration: 'none',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                                            }}
                                        >
                                            <ExternalLink size={14} />
                                            Site web
                                        </a>
                                        {tool.github && (
                                            <a
                                                href={tool.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.5rem 1rem',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    borderRadius: '0.5rem',
                                                    color: '#cbd5e1',
                                                    textDecoration: 'none',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                                }}
                                            >
                                                <Github size={14} />
                                                GitHub
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    textAlign: 'center',
                    marginTop: '3rem'
                }}>
                    <Download size={40} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Tous ces outils sont gratuits et open-source
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
                        Licences: GPL, BSD, MIT, Apache 2.0, Public Domain
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OpenSourceTools;
