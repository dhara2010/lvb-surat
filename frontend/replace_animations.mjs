import fs from 'fs';
import path from 'path';

const SRC_DIR = 'src';

function getFiles(dir, exts) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file, exts));
    } else {
      if (!exts || exts.some(ext => file.toLowerCase().endsWith(ext))) {
        results.push(file);
      }
    }
  });
  return results;
}

function updateJSX() {
  const jsxFiles = getFiles(SRC_DIR, ['.jsx']);
  
  for (const file of jsxFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    let changed = false;

    // Replace SlideUp component usage
    if (content.includes('<SlideUp') || content.includes('</SlideUp>')) {
      content = content.replace(/<SlideUp/g, '<ScrollReveal3D');
      content = content.replace(/<\/SlideUp>/g, '</ScrollReveal3D>');
      
      // Update import path
      // e.g. import { SlideUp } from '../../../components/animations/SlideUp';
      content = content.replace(/import\s+{\s*SlideUp\s*(?:,\s*FadeIn)?\s*}\s*from\s*['"](.*?)SlideUp['"];?/g, 
        (match, prefix) => `import { ScrollReveal3D } from '${prefix}ScrollReveal3D';`);
        
      content = content.replace(/import\s+{\s*SlideUp\s*}\s*from\s*['"](.*?)SlideUp['"];?/g, 
        (match, prefix) => `import { ScrollReveal3D } from '${prefix}ScrollReveal3D';`);
      
      changed = true;
    }
    
    // Also remove ScrollLine if present
    if (content.includes('ScrollLine')) {
       content = content.replace(/import.*?ScrollLine.*?;/g, '');
       content = content.replace(/<ScrollLine.*?\/>/g, '');
       changed = true;
    }
    
    if (changed) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated ${file}`);
    }
  }
}

updateJSX();
