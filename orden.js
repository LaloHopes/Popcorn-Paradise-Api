// Importaciones de módulos
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Inicialización de la aplicación Express
const app = express();

// Middleware
app.use(express.json()); // Middleware para el manejo de datos JSON
app.use(cors()); // Middleware para habilitar CORS

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGOD_URI);
const db = mongoose.connection;

// Manejadores de eventos para la conexión a la base de datos
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
    console.log("Conectado a la base de datos MongoDB");
});

// Definición de esquemas y modelos

// Esquema y modelo de Usuario
const userSchema = new mongoose.Schema({ user: {
    type: String,
    required: [true, "El nombre de usuario es obligatorio"],
},
email: {
    type: String,
    required: [true, "El correo electrónico es obligatorio"],
},
password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
},
edad: {
    type: Number,
    required: [true, "La edad es obligatoria"],
},
idrol: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "El ID del rol es obligatorio"],
}});

const User = mongoose.model("users", userSchema);

// Esquema y modelo de Género
const generoSchema = new mongoose.Schema({ nomgenero: {
    type: String,
    required: [true, "El nombre del género es obligatorio"],
}});

const Genero = mongoose.model("genero", generoSchema);

// Esquema y modelo de Clasificación
const clasificacionSchema = new mongoose.Schema({
    nomclasificacion: {
    type: String,
    required: [true, "El nombre de clasificación es obligatorio"],
},
descripcion: {
    type: String,
    required: [true, "La descripción es obligatoria"],
}});

const Clasificacion = mongoose.model("clasificacion", clasificacionSchema);

// Esquema y modelo de Película
const movieSchema = new mongoose.Schema({ 
    nombre: {
    type: String,
    required: [true, "El nombre de la película es obligatorio"],
},
idgenero: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "genero",
    required: [true, "El ID de género es obligatorio"],
},
descripcion: {
    type: String,
    required: [true, "La descripción de la película es obligatoria"],
},
idclasificacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "clasificacion",
    required: [true, "El ID de clasificación es obligatorio"],
},
p_movie: {
    type: Number,
    required: [true, "La duración de la película es obligatoria"],
},
foto: String});

const Movie = mongoose.model("movie", movieSchema);

// Esquema y modelo de Rol
const rolesSchema = new mongoose.Schema({
    nomrol: {
    type: String,
    required: [true, "El nombre del rol es obligatorio"],
}});

const Roles = mongoose.model("roles", rolesSchema);

// Esquema y modelo de Pedido
const pedidoSchema = new mongoose.Schema({
    iduser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "El ID de usuario es obligatorio"],
},
idmovie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "movie",
    required: [true, "El ID de película es obligatorio"],
}});

const Pedido = mongoose.model("pedido", pedidoSchema);

// Rutas

// Ruta de Login
app.post("/login", async (req, res) => {/*...*/});

// Rutas CRUD de Usuarios
app.get("/users", async (req, res) => {/*...*/});
app.post("/users", async (req, res) => {/*...*/});
app.put("/users/:id", async (req, res) => {/*...*/});
app.delete("/users/:id", async (req, res) => {/*...*/});

// Rutas CRUD de Géneros
app.get("/genero", async (req, res) => {/*...*/});
app.post("/genero", async (req, res) => {/*...*/});
app.put("/genero/:id", async (req, res) => {/*...*/});
app.delete("/genero/:id", async (req, res) => {/*...*/});

// Rutas CRUD de Clasificaciones
app.get("/clasificacion", async (req, res) => {/*...*/});
app.post("/clasificacion", async (req, res) => {/*...*/});
app.put("/clasificacion/:id", async (req, res) => {/*...*/});
app.delete("/clasificacion/:id", async (req, res) => {/*...*/});

// Rutas CRUD de Películas
app.get("/movie", async (req, res) => {/*...*/});
app.post("/movie", async (req, res) => {/*...*/});
app.put("/movie/:id", async (req, res) => {/*...*/});
app.delete("/movie/:id", async (req, res) => {/*...*/});

// Rutas CRUD de Roles
app.get("/roles", async (req, res) => {/*...*/});
app.post("/roles", async (req, res) => {/*...*/});
app.put("/roles/:id", async (req, res) => {/*...*/});
app.delete("/roles/:id", async (req, res) => {/*...*/});

// Rutas CRUD de Pedidos
app.get("/pedido", async (req, res) => {/*...*/});
app.post("/pedido", async (req, res) => {/*...*/});
app.put("/pedido/:id", async (req, res) => {/*...*/});
app.delete("/pedido/:id", async (req, res) => {/*...*/});

// Puerto de escucha
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
