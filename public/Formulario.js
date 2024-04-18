// Formulario.js
import React, { useState } from 'react';
import axios from 'axios';

const Formulario = () => {
  const [nuevoJuego, setNuevoJuego] = useState({
    Titulo: '',
    Plataforma: '',
    Desarrollador: '',
    Precio: 0,
    Stock: 0,
  });

  const enviarFormulario = () => {
    axios.post('http://localhost:3000/agregarJuego', nuevoJuego)
      .then(response => {
        console.log(response.data);
        // Puedes manejar la respuesta según tus necesidades
      })
      .catch(error => {
        console.error('Error al enviar el formulario', error);
      });
  };

  const manejarCambios = e => {
    setNuevoJuego({
      ...nuevoJuego,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h2>Agregar Juego</h2>
      <form>
        <label htmlFor="titulo">Título:</label>
        <input type="text" id="titulo" name="Titulo" onChange={manejarCambios} required />

        <label htmlFor="plataforma">Plataforma:</label>
        <input type="text" id="plataforma" name="Plataforma" onChange={manejarCambios} required />

        <label htmlFor="desarrollador">Desarrollador:</label>
        <input type="text" id="desarrollador" name="Desarrollador" onChange={manejarCambios} required />

        <label htmlFor="precio">Precio:</label>
        <input type="number" id="precio" name="Precio" step="0.01" onChange={manejarCambios} required />

        <label htmlFor="stock">Stock:</label>
        <input type="number" id="stock" name="Stock" onChange={manejarCambios} required />

        <button type="button" onClick={enviarFormulario}>Enviar</button>
      </form>
    </div>
  );
};

export default Formulario;
