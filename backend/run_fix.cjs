const fs = require('fs');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');

const URL = process.env.DATABASE_URL;

mongoose.connect(URL).then(async () => {
    const Member = mongoose.connection.collection('members');
    const members = await Member.find().toArray();
    let updates = 0;
    
    for (let m of members) {
        let logo = m.logoUrl;
        if (logo && logo.toLowerCase().includes('members')) {
            logo = logo.replace(/MEMBERS/gi, 'members');
            logo = logo.replace(/LOGO\.JPG|logo\.jpg/gi, 'logo.png');
            logo = logo.replace(/\/+/g, '/');
        }
        if (logo && !logo.startsWith('/')) {
            logo = '/' + logo;
        }

        if (m.logoUrl !== logo) {
            await Member.updateOne({_id: m._id}, {$set: {logoUrl: logo}});
            console.log('Fixed', m.logoUrl, '->', logo);
            updates++;
        }
    }
    console.log('Total fixed part 2:', updates);
    process.exit(0);
});
