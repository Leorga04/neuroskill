const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener puntuaciones de un usuario
router.get('/usuario/:id', (req, res) => {
    const { id } = req.params;
    db.query(
        'SELECT p.id, p.puntuacion, p.fecha, m.nombre AS minijuego FROM puntuaciones p JOIN minijuegos m ON p.id_minijuego = m.id WHERE p.id_usuario = ?', 
        [id], 
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
});

// Guardar una nueva puntuación
router.post('/', (req, res) => {
  const { id_usuario, minijuego, puntuacion } = req.body;

  if (!id_usuario || !minijuego || puntuacion == null) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  db.query(
    'INSERT INTO puntuaciones (id_usuario, minijuego, puntuacion) VALUES (?, ?, ?)',
    [id_usuario, minijuego, puntuacion],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    }
  );
});

  
  

module.exports = router;
