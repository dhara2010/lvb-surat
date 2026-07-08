const fs = require('fs');
const path = require('path');
const dataFile = fs.readFileSync('src/pages/Home/data.js', 'utf8');

if (!fs.existsSync('src/data')) fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/index.js', dataFile);

const compDir = 'src/pages/Home/components';
const files = fs.readdirSync(compDir);
files.forEach(f => {
  if (f.endsWith('.jsx')) {
    let content = fs.readFileSync(path.join(compDir, f), 'utf8');
    content = content.replace(/from '\.\.\/data'/g, "from '../../../data'");
    content = content.replace(/from '\.\/SlideUp'/g, "from '../../../components/animations/SlideUp'");
    fs.writeFileSync(path.join(compDir, f), content);
  }
});

// Also remove SlideUp from the old place since it's global now
if (fs.existsSync('src/pages/Home/components/SlideUp.jsx')) {
  fs.unlinkSync('src/pages/Home/components/SlideUp.jsx');
}
