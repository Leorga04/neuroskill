const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { id_usuario, dificultad, tiempo, nombre_usuario } = req.body;

  if (!id_usuario || !tiempo || !nombre_usuario || dificultad == null) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  db.query(
    'INSERT INTO memoria (id_usuario, dificultad, tiempo, nombre_usuario) VALUES (?, ?, ?, ?)',
    [id_usuario, dificultad, tiempo, nombre_usuario],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    }
  );
});

router.get('/records', (req, res) => {
  db.query(
    'SELECT dificultad, tiempo, nombre_usuario FROM memoria',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});


module.exports = router;
