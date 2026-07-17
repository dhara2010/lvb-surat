const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      if (!name.includes('node_modules')) {
        getFiles(name, files);
      }
    } else {
      if (name.endsWith('.jsx') || name.endsWith('.js') || name.endsWith('.css')) {
        files.push(name);
      }
    }
  }
  return files;
}

const files = getFiles('frontend/src');
let resolvedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('<<<<<<< HEAD')) {
    
    // Regular expression to match conflict markers and capture the incoming branch block
    // We are aggressively seeking out the block that is below `=======` and above `>>>>>>>`
    const conflictRegex = /<<<<<<< HEAD[\s\S]*?=======\r?\n([\s\S]*?)>>>>>>>[^\r\n]*\r?\n?/g;
    
    let resolvedContent = content.replace(conflictRegex, '$1');
    
    fs.writeFileSync(file, resolvedContent, 'utf8');
    console.log(`Resolved conflicts in ${file}`);
    resolvedCount++;
  }
}

console.log(`Total files resolved: ${resolvedCount}`);
