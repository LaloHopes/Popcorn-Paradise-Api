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

// Esquema RolxPermiso
const rolxpermisoSchema = new mongoose.Schema({
    idrol: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rol",
        required: [true, "El ID es obligatorio"],
    },
    idpermiso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "permiso",
        required: [true, "El ID es obligatorio"],
    }
});

const RolxPermiso = mongoose.model("rolxpermiso", rolxpermisoSchema);

// Esquema de Permiso
const permisoSchema = new mongoose.Schema({
    nompermiso: {
        type: String,
        required: [true, "El nombre es obligatorio"],
    },
    clave: {
        type: String,
        required: [true, "La clave es obligatoria"],
    }
});

const Permiso = mongoose.model("permiso", permisoSchema);

// Esquema de Detalle Compra
const detalle_compraSchema = new mongoose.Schema({
  
    idmovie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "movie",
        required: [true, "El ID es obligatorio"],
    },
    precio: {
        type: Number,
        required: [true, "El precio de la película es obligatoria"],
    },
    cantidad: {
        type: Number,
        required: [true, "La cantidad es obligatoria"],
    },
    idcompra: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "compra",
        required: [true, "El ID es obligatorio"],
    }
});

const Detalle_Compra = mongoose.model("detalle_compra", detalle_compraSchema);

// Esquema de Compra
const compraSchema = new mongoose.Schema({
    iduser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "El ID del user es obligatorio"],
    },
    idmovie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "movie",
        required: [true, "El ID es obligatorio"],
    },
    total: {
        type: Number,
        required: [true, "El precio de la película es obligatoria"],
    },
    fecha: {
        type: Date,
        required: [true, "La fecha es obligatoria"],
    },
    idpedido: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "pedido",
        required: [true, "El ID es obligatorio"],
    }
    ,
    status: {
        type: Number,
        required: [true, "El status es obligatoria"],
    }
});

const Compra = mongoose.model("compra", compraSchema);

// Rutas

// Ruta de Login
app.post("/login", async (req, res) => {const { email, password } = req.body;
try {
    const user = await User.findOne({ email, password });
    if (!user) {
        return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }
    res.json({ message: "Inicio de sesión exitoso" });
} catch (error) {
    console.error("Error al iniciar sesión", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});

// Rutas CRUD de Usuarios
app.get("/users", async (req, res) => {try {
    const users = await User.find();
    res.json(users);
} catch (error) {
    console.error("Error al obtener todos los usuarios", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.post("/users", async (req, res) => {try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
} catch (error) {
    console.error("Error al crear un nuevo usuario", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.put("/users/:id", async (req, res) => {const { id } = req.params;
try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(updatedUser);
} catch (error) {
    console.error("Error al actualizar el usuario", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.delete("/users/:id", async (req, res) => {const { id } = req.params;
try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(deletedUser);
} catch (error) {
    console.error("Error al eliminar el usuario", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});

// Rutas CRUD de Géneros
app.get("/genero", async (req, res) => {try {
    const genero = await Genero.find();
    res.json(genero);
} catch (error) {
    console.error("Error al obtener todos los géneros", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.post("/genero", async (req, res) => {try {
    const newGenero = new Genero(req.body);
    await newGenero.save();
    res.status(201).json(newGenero);
} catch (error) {
    console.error("Error al crear un nuevo género", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.put("/genero/:id", async (req, res) => {const { id } = req.params;
try {
    const updatedGenero = await Genero.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedGenero) {
        return res.status(404).json({ error: "Género no encontrado" });
    }
    res.json(updatedGenero);
} catch (error) {
    console.error("Error al actualizar el género", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.delete("/genero/:id", async (req, res) => {const { id } = req.params;
try {
    const deletedGenero = await Genero.findByIdAndDelete(id);
    if (!deletedGenero) {
        return res.status(404).json({ error: "Género no encontrado" });
    }
    res.json(deletedGenero);
} catch (error) {
    console.error("Error al eliminar el género", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});

// Rutas CRUD de Clasificaciones
app.get("/clasificacion", async (req, res) => {try {
        const clasificaciones = await Clasificacion.find();
        res.json(clasificaciones);
    } catch (error) {
        console.error("Error al obtener todas las clasificaciones", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.post("/clasificacion", async (req, res) => {try {
        const nuevaClasificacion = new Clasificacion(req.body);
        await nuevaClasificacion.save();
        res.status(201).json(nuevaClasificacion);
    } catch (error) {
        console.error("Error al crear una nueva clasificación", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.put("/clasificacion/:id", async (req, res) => {const { id } = req.params;
    try {
        const updatedClasificacion = await Clasificacion.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedClasificacion) {
            return res.status(404).json({ error: "Clasificación no encontrada" });
        }
        res.json(updatedClasificacion);
    } catch (error) {
        console.error("Error al actualizar la clasificación", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.delete("/clasificacion/:id", async (req, res) => {const { id } = req.params;
    try {
        const deletedClasificacion = await Clasificacion.findByIdAndDelete(id);
        if (!deletedClasificacion) {
            return res.status(404).json({ error: "Clasificación no encontrada" });
        }
        res.json(deletedClasificacion);
    } catch (error) {
        console.error("Error al eliminar la clasificación", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


// Rutas CRUD de Películas
app.get("/movie", async (req, res) => {try {
    const movies = await Movie.find();
    res.json(movies);
} catch (error) {
    console.error("Error al obtener todas las películas", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.post("/movie", async (req, res) => { try {
    const nuevaMovie = new Movie(req.body);
    await nuevaMovie.save();
    res.status(201).json(nuevaMovie);
} catch (error) {
    console.error("Error al crear una nueva película", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.put("/movie/:id", async (req, res) => { const { id } = req.params;
try {
    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedMovie) {
        return res.status(404).json({ error: "Película no encontrada" });
    }
    res.json(updatedMovie);
} catch (error) {
    console.error("Error al actualizar la película", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.delete("/movie/:id", async (req, res) => { const { id } = req.params;
try {
    const deletedMovie = await Movie.findByIdAndDelete(id);
    if (!deletedMovie) {
        return res.status(404).json({ error: "Película no encontrada" });
    }
    res.json(deletedMovie);
} catch (error) {
    console.error("Error al eliminar la película", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});

// Rutas CRUD de Roles
app.get("/roles", async (req, res) => {try {
    const roles = await Roles.find();
    res.json(roles);
} catch (error) {
    console.error("Error al obtener todos los roles", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.post("/roles", async (req, res) => {try {
    const nuevoRol = new Roles(req.body);
    await nuevoRol.save();
    res.status(201).json(nuevoRol);
} catch (error) {
    console.error("Error al crear un nuevo rol", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.put("/roles/:id", async (req, res) => {const { id } = req.params;
try {
    const updatedRol = await Roles.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedRol) {
        return res.status(404).json({ error: "Rol no encontrado" });
    }
    res.json(updatedRol);
} catch (error) {
    console.error("Error al actualizar el rol", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.delete("/roles/:id", async (req, res) => {const { id } = req.params;
try {
    const deletedRol = await Roles.findByIdAndDelete(id);
    if (!deletedRol) {
        return res.status(404).json({ error: "Rol no encontrado" });
    }
    res.json(deletedRol);
} catch (error) {
    console.error("Error al eliminar el rol", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});

// Rutas CRUD de Pedidos
app.get("/pedido", async (req, res) => {try {
    const pedidos = await Pedido.find();
    res.json(pedidos);
} catch (error) {
    console.error("Error al obtener todos los pedidos", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.post("/pedido", async (req, res) => {try {
    const nuevoPedido = new Pedido(req.body);
    await nuevoPedido.save();
    res.status(201).json(nuevoPedido);
} catch (error) {
    console.error("Error al crear un nuevo pedido", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.put("/pedido/:id", async (req, res) => {const { id } = req.params;
try {
    const updatedPedido = await Pedido.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPedido) {
        return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.json(updatedPedido);
} catch (error) {
    console.error("Error al actualizar el pedido", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.delete("/pedido/:id", async (req, res) => { const { id } = req.params;
try {
    const deletedPedido = await Pedido.findByIdAndDelete(id);
    if (!deletedPedido) {
        return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.json(deletedPedido);
} catch (error) {
    console.error("Error al eliminar el pedido", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});

// Rutas CRUD de permiso
app.get("/permiso", async (req, res) => {try {
    const permiso = await Permiso.find();
    res.json(permiso);
} catch (error) {
    console.error("Error al obtener todos los rolxpermiso", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.post("/permiso", async (req, res) => {try {
    const permiso = new Permiso(req.body);
    await permiso.save();
    res.status(201).json(permiso);
} catch (error) {
    console.error("Error al crear", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.put("/permiso/:id", async (req, res) => {const { id } = req.params;
try {
    const updatedPermiso = await Permiso.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPermiso) {
        return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.json(updatedPermiso);
} catch (error) {
    console.error("Error al actualizar el pedido", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.delete("/permiso/:id", async (req, res) => {const { id } = req.params;
try {
    const deletedPermiso = await Permiso.findByIdAndDelete(id);
    if (!deletedPermiso) {
        return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.json(deletedPermiso);
} catch (error) {
    console.error("Error al eliminar el pedido", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});

// Rutas CRUD de rolxpermiso
app.get("/rolxpermiso", async (req, res) => {try {
    const rolxpermiso = await RolxPermiso.find();
    res.json(rolxpermiso);
} catch (error) {
    console.error("Error al obtener todos los rolxpermiso", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.post("/rolxpermiso", async (req, res) => {try {
    const rolxpermiso = new RolxPermiso(req.body);
    await rolxpermiso.save();
    res.status(201).json(rolxpermiso);
} catch (error) {
    console.error("Error al crear", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.put("/rolxpermiso/:id", async (req, res) => {const { id } = req.params;
try {
    const updatedRolxPermiso = await RolxPermiso.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedRolxPermiso) {
        return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.json(updatedRolxPermiso);
} catch (error) {
    console.error("Error al actualizar el pedido", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});
app.delete("/rolxpermiso/:id", async (req, res) => {const { id } = req.params;
try {
    const deletedRolxPermiso = await RolxPermiso.findByIdAndDelete(id);
    if (!deletedRolxPermiso) {
        return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.json(deletedRolxPermiso);
} catch (error) {
    console.error("Error al eliminar el pedido", error);
    res.status(500).json({ error: "Error interno del servidor" });
}});

// Rutas CRUD de compra
app.get("/compra", async (req, res) => {try {
        const compra = await Compra.find();
        res.json(compra);
    } catch (error) {
        console.error("Error al obtener datos", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.post("/compra", async (req, res) => {try {
        const nuevoCompra = new Compra(req.body);
        await nuevoCompra.save();
        res.status(201).json(nuevoCompra);
    } catch (error) {
        console.error("Error al crear un nueva compra", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.put("/compra/:id", async (req, res) => {const { id } = req.params;
    try {
        const updatedCompra = await Compra.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCompra) {
            return res.status(404).json({ error: "Compra no encontrado" });
        }
        res.json(updatedCompra);
    } catch (error) {
        console.error("Error al actualizar compra", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.delete("/compra/:id", async (req, res) => {const { id } = req.params;
    try {
        const deletedCompra = await Compra.findByIdAndDelete(id);
        if (!deletedCompra) {
            return res.status(404).json({ error: "Compra no encontrado" });
        }
        res.json(deletedCompra);
    } catch (error) {
        console.error("Error al eliminar el compra", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Rutas CRUD de detallecompra
app.get("/detalle_compra", async (req, res) => {try {
        const detalle_compra = await Detalle_Compra.find();
        res.json(detalle_compra);
    } catch (error) {
        console.error("Error al obtener datos", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.post("/detalle_compra", async (req, res) => {try {
        const nuevoDetalle_Compra = new Detalle_Compra(req.body);
        await nuevoDetalle_Compra.save();
        res.status(201).json(nuevoDetalle_Compra);
    } catch (error) {
        console.error("Error al crear un nuevo Detalle_Compra", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.put("/detalle_compra/:id", async (req, res) => {const { id } = req.params;
    try {
        const updatedDetalle_Compra = await Detalle_Compra.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedDetalle_Compra) {
            return res.status(404).json({ error: "Detalle_Compra no encontrado" });
        }
        res.json(updatedDetalle_Compra);
    } catch (error) {
        console.error("Error al actualizar Detalle_Compra", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.delete("/detalle_compra/:id", async (req, res) => {const { id } = req.params;
    try {
        const deletedDetalle_Compra = await Detalle_Compra.findByIdAndDelete(id);
        if (!deletedDetalle_Compra) {
            return res.status(404).json({ error: "Detalle_Compra no encontrado" });
        }
        res.json(deletedDetalle_Compra);
    } catch (error) {
        console.error("Error al eliminar el Detalle_Compra", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Puerto de escucha
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
