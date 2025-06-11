const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { id_usuario, puntuacion, nombre_usuario, dificultad } = req.body;

  if (!id_usuario || !puntuacion || !nombre_usuario || dificultad == null) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  db.query(
    'INSERT INTO aim (id_usuario, puntuacion, `nombre usuario`, dificultad) VALUES (?, ?, ?, ?)',
    [id_usuario, puntuacion, nombre_usuario, dificultad],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    }
  );
});
router.get('/records', (req, res) => {
  db.query(
    'SELECT puntuacion, `nombre usuario` AS nombre_usuario, dificultad FROM aim',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});
 module.exports = router;