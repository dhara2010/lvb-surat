const Member = require('../models/Member');

const mapId = (doc) => {
  const obj = doc.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({name: 1});
    res.json(members.map(mapId));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createMember = async (req, res) => {
  try {
    await Member.create(req.body);
    res.json({ message: 'Added successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateMember = async (req, res) => {
  try {
    await Member.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteMember = async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
