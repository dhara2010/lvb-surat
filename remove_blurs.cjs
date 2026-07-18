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
      if (name.endsWith('.jsx')) files.push(name);
    }
  }
  return files;
}

const files = getFiles('frontend/src');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Clean up all blur/glowing elements used in dark theme
  content = content.replace(/<div[^>]*blur-\[1\d{2}px\][^>]*>[\s\S]*?<\/div>/g, '');
  content = content.replace(/<div[^>]*blur-3xl[^>]*>[\s\S]*?<\/div>/g, '');
  content = content.replace(/<div[^>]*blur-2xl[^>]*>[\s\S]*?<\/div>/g, '');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Cleaned up glowing blurs in ${file}`);
  }
}
