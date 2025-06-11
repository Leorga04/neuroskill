const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { id_usuario, puntuacion, nombre_usuario,} = req.body;

  if (!id_usuario || puntuacion == null || !nombre_usuario) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  db.query(
    'INSERT INTO velocidad (id_usuario, puntuacion, nombre_usuario) VALUES (?, ?, ?)',
    [id_usuario, puntuacion, nombre_usuario],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    }
  );
});

router.get('/records', (req, res) => {
  db.query(
    'SELECT nombre_usuario, puntuacion FROM velocidad ORDER BY puntuacion DESC LIMIT 10',
    (err, results) => {
      if (err) {
        console.error('❌ Error al obtener récords:', err);
        res.status(500).json({ error: 'Error al obtener récords' });
      } else {
        res.json(results);
      }
    }
  );
});



module.exports = router;