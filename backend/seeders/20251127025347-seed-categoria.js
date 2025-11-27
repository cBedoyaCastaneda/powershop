'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // NOTA: Si tu tabla en la base de datos se llama 'categorias' (en minúsculas),
    // debes cambiar 'Categoria' por 'categorias' en este bulkInsert.
    await queryInterface.bulkInsert('Categoria', [
      {
        nombre: 'Telekinesis',
        descripcion: 'Habilidad para mover o manipular objetos con la mente.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Elementales',
        descripcion: 'Control y manipulación de elementos naturales (fuego, agua, aire, tierra).',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Velocidad',
        descripcion: 'Capacidad de moverse a velocidades extraordinarias.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Fuerza',
        descripcion: 'Poder físico superior, permitiendo levantar objetos pesados y resistir impactos.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Invisibilidad',
        descripcion: 'Habilidad para volverse indetectable a la vista.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Teletransportacion',
        descripcion: 'Capacidad de moverse instantáneamente de un lugar a otro.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categoria', null, {});
  }
};