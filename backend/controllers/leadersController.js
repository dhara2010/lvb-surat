const Leader = require('../models/Leader');

const mapId = (doc) => {
  const obj = doc.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

exports.getLeaders = async (req, res) => {
  try {
    const leaders = await Leader.find();
    res.json(leaders.map(mapId));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createLeader = async (req, res) => {
  try {
    await Leader.create(req.body);
    res.json({ message: 'Added successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateLeader = async (req, res) => {
  try {
    await Leader.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteLeader = async (req, res) => {
  try {
    await Leader.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
