const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { id_usuario, dificultad, puntuacion, nombre_usuario } = req.body;

  if (!id_usuario || !puntuacion || !nombre_usuario || dificultad == null) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  db.query(
    'INSERT INTO seguimiento (id_usuario, dificultad, puntuacion, nombre_usuario) VALUES (?, ?, ?, ?)',
    [id_usuario, dificultad, puntuacion, nombre_usuario],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    }
  );
});

router.get('/records', (req, res) => {
  db.query(
    'SELECT dificultad, puntuacion, nombre_usuario FROM seguimiento',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

module.exports = router;
