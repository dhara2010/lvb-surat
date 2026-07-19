  exports.uploadImage = (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    
    const imageUrl = `/uploads/gallery/${req.file.filename}`;
    
    res.json({ imageUrl });
  };
