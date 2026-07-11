import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = 'public';
const SRC_DIR = 'src';

// Recursively find files
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

// Convert images to webp and delete old
async function optimizeImages() {
  const images = getFiles(PUBLIC_DIR, ['.png', '.jpg', '.jpeg']);
  const converted = new Map(); // oldName -> newName
  
  for (const imgPath of images) {
    if (imgPath.endsWith('favicon.png') || imgPath.endsWith('favicon.ico')) continue; // Skip favicons
    
    const parsed = path.parse(imgPath);
    const newPath = path.join(parsed.dir, parsed.name + '.webp');
    
    // Only process files larger than 100KB to save time, or just all of them
    const stat = fs.statSync(imgPath);
    if (stat.size > 50 * 1024) { // > 50KB
      console.log(`Converting ${imgPath} to WEBP...`);
      await sharp(imgPath)
        .webp({ quality: 80 })
        .toFile(newPath);
      
      converted.set('/' + path.relative(PUBLIC_DIR, imgPath).replace(/\\/g, '/'), '/' + path.relative(PUBLIC_DIR, newPath).replace(/\\/g, '/'));
    }
  }
  return converted;
}

// Update JSX files
function updateJSX(convertedMap) {
  const jsxFiles = getFiles(SRC_DIR, ['.jsx']);
  
  for (const file of jsxFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    let changed = false;

    // Replace old image paths with new .webp paths
    for (const [oldPath, newPath] of convertedMap.entries()) {
      // Very basic replace, assuming they are used as src="/path" or similar
      const escapedOldPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(['"\`])${escapedOldPath}(['"\`])`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `$1${newPath}$2`);
        changed = true;
      }
    }

    const imgRegex = /<img\s+([^>]+)>/g;
    content = content.replace(imgRegex, (match, p1) => {
      // Don't add if already has loading
      if (p1.includes('loading=') || file.includes('Layout.jsx') || file.includes('Navbar.jsx')) {
        return match;
      }
      return `<img loading="lazy" decoding="async" ${p1}>`;
    });
    
    if (content !== fs.readFileSync(file, 'utf-8')) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated ${file}`);
    }
  }
}

async function main() {
  console.log('Starting optimization...');
  const converted = await optimizeImages();
  console.log('Updating JSX files...');
  updateJSX(converted);
  console.log('Optimization complete.');
}

main().catch(console.error);
