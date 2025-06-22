//-| File path: addFiles.js
const fs = require('fs');
const path = require('path');

function createFileWithComment(filepath) {
    try {
        // Check if file already exists
        if (fs.existsSync(filepath)) {
            console.log(`Skipped (already exists): ${filepath}`);
            return;
        }
        
        // Create directory structure if it doesn't exist
        const dir = path.dirname(filepath);
        if (dir !== '.' && !fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Create the file with the comment
        const content = `//-| Filepath: ${filepath}\n`;
        fs.writeFileSync(filepath, content);
        
        console.log(`Created: ${filepath}`);
    } catch (error) {
        console.error(`Error creating ${filepath}:`, error.message);
    }
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node addFiles.js <filepath1> <filepath2> ...');
        console.log('Example: node addFiles.js app/dashboard/Component.tsx app/dashboard/ComponentTwo.tsx');
        process.exit(1);
    }
    
    args.forEach(filepath => {
        createFileWithComment(filepath);
    });
}

main();