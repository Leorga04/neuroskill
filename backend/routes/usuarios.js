const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ GET para obtener usuarios (necesario para registro.component.ts)
router.get("/", (req, res) => {
  db.query(
    "SELECT id, nombre_usuario, correo FROM usuarios",
    (err, results) => {
      if (err) {
        console.error("Error al obtener usuarios:", err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// ✅ POST para login
router.post("/login", (req, res) => {
  const { correo, contrasena } = req.body;

  console.log("🧪 Intento de login con:", correo, contrasena);

  db.query(
    "SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?",
    [correo, contrasena],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length === 0) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      res.status(200).json({
        message: "Inicio de sesión exitoso",
        user: {
          id: results[0].id,
          nombre_usuario: results[0].nombre_usuario,
        },
      });
    }
  );
});

// ✅ POST para registrar usuario
router.post("/", (req, res) => {
  const { nombre_usuario, correo, contrasena } = req.body;
  db.query(
    "INSERT INTO usuarios (nombre_usuario, correo, contrasena) VALUES (?, ?, ?)",
    [nombre_usuario, correo, contrasena],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    }
  );
});

module.exports = router;
