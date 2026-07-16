const Chapter = require('../models/Chapter');

const mapId = (doc) => {
  const obj = doc.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

exports.getChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find().sort({ name: 1 });
    res.json(chapters.map(mapId));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createChapter = async (req, res) => {
  try {
    await Chapter.create(req.body);
    res.json({ message: 'Added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateChapter = async (req, res) => {
  try {
    await Chapter.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteChapter = async (req, res) => {
  try {
    await Chapter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
