const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');
const outputFile = path.join(dataDir, 'disciplines.json');

// Lire tous les fichiers JSON du dossier data
const files = fs.readdirSync(dataDir)
  .filter(file => file.endsWith('.json') && 
    file !== 'disciplines.json' && 
    file !== 'munin-complete.json' &&
    file !== 'modulesConfig.ts');

const disciplines = [];

files.forEach(file => {
  try {
    const filePath = path.join(dataDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Extraire l'ID du nom de fichier
    const id = file.replace('.json', '');
    
    // Créer l'entrée de discipline
    const discipline = {
      id: id,
      name: data.name || id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      description: data.description || `Étude de ${data.name || id}`,
      entities: data.entities || []
    };
    
    disciplines.push(discipline);
  } catch (error) {
    console.error(`Erreur lors du traitement de ${file}:`, error.message);
  }
});

// Trier par nom
disciplines.sort((a, b) => a.name.localeCompare(b.name));

// Écrire le fichier
fs.writeFileSync(outputFile, JSON.stringify(disciplines, null, 2));

console.log(`✓ ${disciplines.length} disciplines générées dans ${outputFile}`);
