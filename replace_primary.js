const fs = require('fs');
const path = require('path');

const files = [
  'frontend/src/pages/Members/index.jsx',
  'frontend/src/pages/Events/index.jsx',
  'frontend/src/pages/EventDetail/index.jsx',
  'frontend/src/pages/Contact/index.jsx',
  'frontend/src/components/ui/SectionHeading.jsx'
];

let helperContent = `import { useLocation } from 'react-router-dom';

export const usePrimaryTextClass = () => {
  const location = useLocation();
  return location.pathname === '/' ? 'text-primary' : 'text-cyan-900';
};
`;
fs.mkdirSync('frontend/src/hooks', { recursive: true });
fs.writeFileSync('frontend/src/hooks/useTheme.js', helperContent);

// Function to safely replace text-primary in classNames of specific elements
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (!content.includes('text-primary')) return;

  // Add the import
  let importPath = filePath.includes('components/ui') ? '../../hooks/useTheme' : '../../hooks/useTheme';
  if (filePath.includes('pages/')) {
    const depth = filePath.split('/').length - 3; // frontend/src/pages/Something/index.jsx
    importPath = '../'.repeat(depth) + '../../hooks/useTheme';
  }

  // Inject hook
  // Find component declaration
  const componentRegex = /export (default )?function ([A-Za-z0-9_]+)\([^)]*\)[\s]*{/;
  const match = content.match(componentRegex);
  if (match) {
    if (!content.includes('usePrimaryTextClass')) {
      content = content.replace(/(import React[^;]*;[\s\n]*)/, `$1import { usePrimaryTextClass } from '${importPath}';\n`);
      const hookString = `\n  const primaryTextClass = usePrimaryTextClass();\n`;
      content = content.replace(match[0], match[0] + hookString);
    }
  }

  // Replace text-primary carefully. Since we only want to change it where it's used in non-links.
  // We'll replace `text-primary` with `${primaryTextClass}`
  
  // It's safer to just do a global replace of "text-primary" -> "${primaryTextClass}"
  // BUT we must change strings "className=..." to string templates className={\`...\`}
  
  // We'll construct a simple regex
  // className="something text-primary something" -> className={\`something \${primaryTextClass} something\`}
  
  const classNameRegex = /className="([^"]*text-primary[^"]*)"/g;
  content = content.replace(classNameRegex, (fullMatch, p1) => {
    let classes = p1;
    classes = classes.replace(/\btext-primary\b/g, '${primaryTextClass}');
    return `className={\`${classes}\`}`;
  });

  // What about existing template literals? className={`something text-primary`}
  const templateRegex = /className=\{`([^`]*text-primary[^`]*)`\}/g;
  content = content.replace(templateRegex, (fullMatch, p1) => {
    let classes = p1;
    classes = classes.replace(/\btext-primary\b/g, '${primaryTextClass}');
    return `className={\`${classes}\`}`;
  });

  fs.writeFileSync(filePath, content);
  console.log('Processed', filePath);
}

for (const file of files) {
  processFile(file);
}
