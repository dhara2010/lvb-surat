const fs = require('fs');
const path = require('path');
require('dotenv').config({path: '../backend/.env'});
const mongoose = require('mongoose');

const URL = process.env.DATABASE_URL;

mongoose.connect(URL).then(async () => {
  const Member = mongoose.connection.collection('members');
  const members = await Member.find().toArray();
  let updates = 0;

  const getExactFile = (url) => {
    if (!url || !url.startsWith('/')) return url;
    let p = path.join(__dirname, 'public', url);
    if (fs.existsSync(p)) return url;
    
    // First, try to just match case inside the directory
    const dir = path.dirname(p);
    const base = path.basename(p);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      const match = files.find(f => f.toLowerCase() === base.toLowerCase());
      if (match) {
        return url.replace(base, match);
      }
      
      // Secondary fallback: what if the DB has .png or .jpg but the file is .webp? Wait!
      const nameWithoutExt = path.parse(base).name;
      const webpMatch = files.find(f => f.toLowerCase() === nameWithoutExt.toLowerCase() + '.webp');
      if (webpMatch) {
          return url.replace(base, webpMatch);
      }
      
      const pngMatch = files.find(f => f.toLowerCase() === nameWithoutExt.toLowerCase() + '.png');
      if (pngMatch) {
          return url.replace(base, pngMatch);
      }
    }
    
    // Check if it's pointing to /gallery/ but it should be /members/
    if (url.startsWith('/gallery/')) {
        let altP = path.join(__dirname, 'public', 'members', base);
        if (fs.existsSync(altP)) return `/members/${base}`;
        const membersDir = path.join(__dirname, 'public', 'members');
        if (fs.existsSync(membersDir)) {
            const mFiles = fs.readdirSync(membersDir);
            const mMatch = mFiles.find(f => f.toLowerCase() === base.toLowerCase());
            if (mMatch) return `/members/${mMatch}`;
            
            const mWebp = mFiles.find(f => f.toLowerCase() === path.parse(base).name.toLowerCase() + '.webp');
            if (mWebp) return `/members/${mWebp}`;
            
            const mPng = mFiles.find(f => f.toLowerCase() === path.parse(base).name.toLowerCase() + '.png');
            if (mPng) return `/members/${mPng}`;
        }
    }

    return url;
  };

  for (let m of members) {
    let photo = m.photoUrl ? getExactFile(m.photoUrl) : m.photoUrl;
    let logo = m.logoUrl ? getExactFile(m.logoUrl) : m.logoUrl;

    if (photo !== m.photoUrl || logo !== m.logoUrl) {
      await Member.updateOne({_id: m._id}, {$set: {photoUrl: photo, logoUrl: logo}});
      console.log('Fixed:', m.name, '\nPhoto:', m.photoUrl, '->', photo, '\nLogo:', m.logoUrl, '->', logo, '\n');
      updates++;
    }
  }

  console.log('Total fixed:', updates);
  process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
