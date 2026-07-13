const mongoose = require('mongoose');
require('dotenv').config();

const Leader = require('./models/Leader');
const Gallery = require('./models/Gallery');

const updateDB = async () => {
  try {
    const MONGO_URI = process.env.DATABASE_URL;
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');
    
    // Update Leaders
    const leaders = await Leader.find();
    for (let leader of leaders) {
       let { img } = leader;
       if (img && (img.endsWith('.png') || img.endsWith('.jpg') || img.endsWith('.jpeg'))) {
          const newImg = img.replace(/\.(png|jpg|jpeg)$/i, '.webp');
          leader.img = newImg;
          await leader.save();
          console.log(`Updated leader ${leader.name} image to ${newImg}`);
       }
    }

    // Update Gallery
    const galleryItems = await Gallery.find();
    for (let item of galleryItems) {
       let { image_url } = item;
       if (image_url && (image_url.endsWith('.png') || image_url.endsWith('.jpg') || image_url.endsWith('.jpeg'))) {
          const newUrl = image_url.replace(/\.(png|jpg|jpeg)$/i, '.webp');
          item.image_url = newUrl;
          await item.save();
          console.log(`Updated gallery image to ${newUrl}`);
       }
    }
    
    console.log('Done updating DB images to WebP.');
    process.exit(0);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

updateDB();
