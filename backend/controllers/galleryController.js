const Gallery = require('../models/Gallery');

const mapId = (doc) => {
  const obj = doc.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

exports.getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find();
    res.json(gallery.map(mapId));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.uploadGallery = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const imageUrl = '/gallery/' + req.file.filename;
    await Gallery.create({ image_url: imageUrl });
    res.json({ message: 'Uploaded successfully', imageUrl });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteGallery = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
