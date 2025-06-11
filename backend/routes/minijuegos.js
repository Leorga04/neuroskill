const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los minijuegos
router.get('/', (req, res) => {
    db.query('SELECT * FROM minijuegos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Crear un nuevo minijuego
router.post('/', (req, res) => {
    const { nombre, descripcion, dificultad } = req.body;
    db.query('INSERT INTO minijuegos (nombre, descripcion, dificultad) VALUES (?, ?, ?)', 
        [nombre, descripcion, dificultad], 
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId });
        }
    );
});

module.exports = router;
