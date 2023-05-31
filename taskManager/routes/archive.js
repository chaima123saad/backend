const express = require('express');
const router = express.Router();

const Archive = require('../models/archive');

router.get('/:id', async (req, res) => {
    try {
      const archive = await Archive.findById(req.params.id);
      if (!archive) {
        return res.status(404).json({ message: 'Archive not found' });
      }
      res.json(archive);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }); 

module.exports = router;