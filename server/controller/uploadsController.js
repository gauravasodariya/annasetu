const fs = require('fs');
const path = require('path');

async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

async function listImages(req, res) {
  try {
    const dir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dir)) {
      return res.json([]);
    }
    const files = fs.readdirSync(dir);
    res.json(files);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

module.exports = {
  uploadImage,
  listImages,
};

