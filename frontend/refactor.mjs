import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replaceRules = [
  // Radii
  { regex: /rounded-\[4px\]/g, replacement: 'rounded-sm' },
  { regex: /rounded-\[8px\]/g, replacement: 'rounded-sm' },
  { regex: /rounded-\[12px\]/g, replacement: 'rounded-md' },
  { regex: /rounded-\[16px\]/g, replacement: 'rounded-md' },
  { regex: /rounded-\[18px\]/g, replacement: 'rounded-md' },
  { regex: /rounded-\[20px\]/g, replacement: 'rounded-lg' },
  { regex: /rounded-\[24px\]/g, replacement: 'rounded-lg' },
  { regex: /rounded-\[28px\]/g, replacement: 'rounded-xl' },
  { regex: /rounded-\[30px\]/g, replacement: 'rounded-xl' },
  { regex: /rounded-\[32px\]/g, replacement: 'rounded-xl' },
  { regex: /rounded-\[40px\]/g, replacement: 'rounded-2xl' },
  { regex: /rounded-\[48px\]/g, replacement: 'rounded-2xl' },
  
  // Shadows (only touching gray/black arbitrary ones)
  { regex: /shadow-\[0_8px_30px_rgb\(0,0,0,0\.0[1-9]\)\]/g, replacement: 'shadow-md' },
  { regex: /shadow-\[0_15px_30px_rgb\(0,0,0,0\.0[1-9]\)\]/g, replacement: 'shadow-lg' },
  { regex: /shadow-\[0_20px_40px_rgb\(0,0,0,0\.0[1-9]\)\]/g, replacement: 'shadow-xl' },
  { regex: /shadow-\[0_20px_60px_-15px_rgba\(0,0,0,0\.0[1-9]\)\]/g, replacement: 'shadow-xl' },
  { regex: /shadow-\[0_4px_20px_rgb\(0,0,0,0\.0[1-9]\)\]/g, replacement: 'shadow-sm' },
  { regex: /shadow-\[0_20px_40px_-15px_rgba\(0,0,0,0\.0[1-9]\)\]/g, replacement: 'shadow-xl' },
  { regex: /shadow-\[0_15px_30px_rgba\(18,59,93,0\.3\)\]/g, replacement: 'shadow-xl' },
  { regex: /shadow-\[0_20px_40px_-15px_rgba\(0,0,0,0\.1\)\]/g, replacement: 'shadow-xl' },
  { regex: /shadow-\[0_8px_20px_rgba\(18,59,93,0\.12\)\]/g, replacement: 'shadow-lg hover-lift' },
  
  // Update class naming for animation states
  { regex: /hover:shadow-\[0_20px_40px_rgb\(0,0,0,0\.08\)\]/g, replacement: 'hover:shadow-xl hover-lift' },
  { regex: /hover:shadow-\[0_20px_40px_-15px_rgba\(0,0,0,0\.08\)\]/g, replacement: 'hover:shadow-xl hover-lift' },
];

let changedFiles = 0;

walkDir(SRC_DIR, function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    replaceRules.forEach(rule => {
      content = content.replace(rule.regex, rule.replacement);
    });
    
    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
      changedFiles++;
    }
  }
});

console.log(`Finished. Files modified: ${changedFiles}`);
