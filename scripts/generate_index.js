const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, './content/safaris');
const outputFile = path.join(__dirname, './content/safaris-index.json');

fs.readdir(contentDir, (err, files) => {
    if (err) {
        console.error('Failed to read safaris folder:', err);
        return;
    }
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    fs.writeFileSync(outputFile, JSON.stringify(jsonFiles, null, 2));
    console.log(`Successfully indexed ${jsonFiles.length} safari files.`);
});