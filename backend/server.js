const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Middlewares
app.use(cors({
    origin: 'http://localhost:4200', // Permite solo solicitudes desde este origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}));
app.use(express.json());

// Rutas

const usuariosRoutes = require('./routes/usuarios');
const minijuegosRoutes = require('./routes/minijuegos');
const puntuacionesRoutes = require('./routes/puntuaciones');
const aimRoutes = require('./routes/aim');
const velocidadRoutes = require('./routes/velocidad');
const memoriaRoutes = require('./routes/memoria');
const seguimientoRoutes = require('./routes/seguimiento');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/minijuegos', minijuegosRoutes);
app.use('/api/puntuaciones', puntuacionesRoutes);
app.use('/api/aim', aimRoutes);
app.use('/api/velocidad', velocidadRoutes);
app.use('/api/memoria', memoriaRoutes);
app.use('/api/seguimiento', seguimientoRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
