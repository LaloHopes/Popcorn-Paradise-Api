// // SERVIDOR BACKENDk PROYECTO Anime University
// PARA LA MATERIA DE BASE DE DATOS /UTM 17-07-24
// Copyright © 2024 Eduardo Antonio Uc Tut. Este proyecto fue elaborado por Eduardo Antonio Uc Tut y se ofrece para fines educativos y de práctica. Se concede permiso para su uso libre, con la condición de que se reconozca la autoría original de Eduardo Antonio Uc Tut en cualquier redistribución o modificación. Este proyecto se proporciona tal cual, sin garantías de ningún tipo, expresas o implícitas.

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGOD_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
    console.log("Conectado a la base de datos MongoDB");
});
        // SERVIDOR ESQUEMAS
const califSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: [true, "Property is required"],
    },
    materiaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Materia",
        required: [true, "Property is required"],
    },
    calificacion: {
        type: Number,
        required: [true, "Property is required"],
    },
});

const userSchema = new mongoose.Schema({
    Nombre: {
        type: String,
        required: [true, "Property is required"],
    },
    Email: {
        type: String,
        required: [true, "Property is required"],
    },
    Pass: {
        type: String,
        required: [true, "Property is required"],
    },
    Edad: {
        type: Number,
        required: [true, "Property is required"],
    },
});

const matSchema = new mongoose.Schema({
    Nombre: {
        type: String,
        required: [true, "Property is required"],
    }
});
//CAMBIOS--13-05.24
const peliculaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, "El título de la película es obligatorio"]
    },
    descripcion: String,
    genero: String,
    clasificacion: String,
    yearLanzamiento: Number,
    puntuacion: {
        type: Number,
        min: 1,
        max: 5
    }
});
const Calificacion = mongoose.model("Calificaciones", califSchema);
const Usuario = mongoose.model("Usuarios", userSchema);
const Materia = mongoose.model("Materias", matSchema);
const Pelicula = mongoose.model("Pelicula", peliculaSchema); //CAMBIOS--13-05.24

            // LOGICA DE LOGIN
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ Email: email, Pass: password });
        if (!usuario) {
            return res.status(401).json({ error: "Correo o contraseña incorrectos" });
        }
        res.json({ message: "Inicio de sesión exitoso" });
    } catch (error) {
        console.error("Error al iniciar sesión", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

                     // Ruta GET CALIFICACION 
app.get("/calificaciones", async (req, res) => {
    try {
        const calificaciones = await Calificacion.find();
        const calificacionesConNombres = await Promise.all(calificaciones.map(async (calificacion) => {
            const usuario = await Usuario.findById(calificacion.userId);
            const materia = await Materia.findById(calificacion.materiaId);
            const usuarioNombre = usuario ? usuario.Nombre : 'Usuario no encontrado';
            const materiaNombre = materia ? materia.Nombre : 'Materia no encontrada';
            
            return {
                userId: usuarioNombre,
                materiaId: materiaNombre,
                calificacion: calificacion.calificacion
            };
        }));
        res.json(calificacionesConNombres);
    } catch (error) {
        console.error("Error al obtener las calificaciones:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

                    // Ruta POST CALIFICACION
app.post("/calificaciones", async (req, res) => {
    try {
        const { userId, materiaId, calificacion } = req.body;
        const nuevaCalificacion = new Calificacion({
            userId,
            materiaId,
            calificacion
        });
        await nuevaCalificacion.save();
        res.status(201).json(nuevaCalificacion);
    } catch (error) {
        console.error("Error al crear calificación:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

                       // Ruta PUT CALIFICACION
app.put("/calificaciones/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, materiaId, calificacion } = req.body;
        const updatedCalificacion = await Calificacion.findByIdAndUpdate(
            id,
            { userId, materiaId, calificacion },
            { new: true }
        );
        if (!updatedCalificacion) {
            return res.status(404).json({ error: "Calificación no encontrada" });
        }
        res.json(updatedCalificacion);
    } catch (error) {
        console.error("Error al actualizar calificación:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

                        // Ruta DELETE CALIFICACION
app.delete("/calificaciones/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCalificacion = await Calificacion.findByIdAndDelete(id);
        if (!deletedCalificacion) {
            return res.status(404).json({ error: "Calificación no encontrada" });
        }
        res.json(deletedCalificacion);
    } catch (error) {
        console.error("Error al eliminar calificación:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

                 // Ruta GET USUARIOS
app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        console.error("Error al obtener todos los usuarios", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
                 // Ruta POST USUARIOS
app.post("/usuarios", async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error("Error al crear un nuevo usuario", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

                 // Ruta PUT USUARIOS
app.put("/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, req.body, { new: true });
        if (!usuarioActualizado) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(usuarioActualizado);
    } catch (error) {
        console.error("Error al actualizar el usuario", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

                 // Ruta DELETE USUARIOS
app.delete("/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(id);
        if (!usuarioEliminado) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(usuarioEliminado);
    } catch (error) {
        console.error("Error al eliminar el usuario", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

                 // Ruta GET MATERIAS
app.get("/materias", async (req, res) => {
  try {
      const materias = await Materia.find();
      res.json(materias);
  } catch (error) {
      console.error("Error al obtener todas las materias:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});

                 // Ruta GET MATERIAS
app.post("/materias", async (req, res) => {
  try {
      const nuevaMateria = new Materia(req.body);
      await nuevaMateria.save();
      res.status(201).json(nuevaMateria);
  } catch (error) {
      console.error("Error al crear una nueva materia:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});

                 // Ruta POST MATERIAS
app.put("/materias/:id", async (req, res) => {
  const { id } = req.params;
  try {
      const materiaActualizada = await Materia.findByIdAndUpdate(id, req.body, { new: true });
      if (!materiaActualizada) {
          return res.status(404).json({ error: "Materia no encontrada" });
      }
      res.json(materiaActualizada);
  } catch (error) {
      console.error("Error al actualizar la materia:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});

                 // Ruta DELETE MATERIAS
app.delete("/materias/:id", async (req, res) => {
  const { id } = req.params;
  try {
      const materiaEliminada = await Materia.findByIdAndDelete(id);
      if (!materiaEliminada) {
          return res.status(404).json({ error: "Materia no encontrada" });
      }
      res.json(materiaEliminada);
  } catch (error) {
      console.error("Error al eliminar la materia:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});
            
//CAMBIOS--13-05.24

// Ruta GET Películas
app.get("/peliculas", async (req, res) => {
    try {
        const peliculas = await Pelicula.find();
        res.json(peliculas);
    } catch (error) {
        console.error("Error al obtener todas las películas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta GET Película por ID
app.get("/peliculas/:id", async (req, res) => {
    try {
        const pelicula = await Pelicula.findById(req.params.id);
        if (!pelicula) {
            return res.status(404).json({ error: "Película no encontrada" });
        }
        res.json(pelicula);
    } catch (error) {
        console.error("Error al obtener la película:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta POST Película
app.post("/peliculas", async (req, res) => {
    try {
        const nuevaPelicula = new Pelicula(req.body);
        await nuevaPelicula.save();
        res.status(201).json(nuevaPelicula);
    } catch (error) {
        console.error("Error al crear una nueva película:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta PUT Película
app.put("/peliculas/:id", async (req, res) => {
    try {
        const peliculaActualizada = await Pelicula.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!peliculaActualizada) {
            return res.status(404).json({ error: "Película no encontrada" });
        }
        res.json(peliculaActualizada);
    } catch (error) {
        console.error("Error al actualizar la película:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta DELETE Película
app.delete("/peliculas/:id", async (req, res) => {
    try {
        const peliculaEliminada = await Pelicula.findByIdAndDelete(req.params.id);
        if (!peliculaEliminada) {
            return res.status(404).json({ error: "Película no encontrada" });
        }
        res.json(peliculaEliminada);
    } catch (error) {
        console.error("Error al eliminar la película:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta PUT Puntuación de Película
app.put("/peliculas/:id/puntuacion", async (req, res) => {
    try {
        const { puntuacion } = req.body;
        if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
            return res.status(400).json({ error: "La puntuación debe estar entre 1 y 5" });
        }
        const peliculaActualizada = await Pelicula.findByIdAndUpdate(
            req.params.id,
            { puntuacion },
            { new: true }
        );
        if (!peliculaActualizada) {
            return res.status(404).json({ error: "Película no encontrada" });
        }
        res.json(peliculaActualizada);
    } catch (error) {
        console.error("Error al actualizar la puntuación de la película:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
// Copyright © 2024 Eduardo Antonio Uc Tut. Este proyecto fue elaborado por Eduardo Antonio Uc Tut y se ofrece para fines educativos y de práctica. Se concede permiso para su uso libre, con la condición de que se reconozca la autoría original de Eduardo Antonio Uc Tut en cualquier redistribución o modificación. Este proyecto se proporciona tal cual, sin garantías de ningún tipo, expresas o implícitas.
