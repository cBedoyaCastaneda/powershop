'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // NOTA: 'Usuario' es el nombre de la tabla si se usa freezeTableName: true y no se especificó un 'tableName' en el modelo.
    // Si tu tabla se llama 'usuarios', cambia el string 'Usuario' a 'usuarios'.
    await queryInterface.bulkInsert('Usuarios', [
      {
        nombre: 'Juan',
        apellido: 'Perez',
        usuario: 'admin_juan',
        email: 'juan.perez@admin.com',
        // Nota: Las contraseñas en producción deben estar hasheadas con bcrypt antes de insertarse.
        password: 'password_admin', 
        direccion: 'Calle Falsa 123',
        esAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Ana',
        apellido: 'Gomez',
        usuario: 'ana_gomez',
        email: 'ana.gomez@user.com',
        password: 'password_user',
        direccion: 'Avenida Siempre Viva 742',
        esAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Adomin',
        apellido: 'Istrador',
        usuario: 'admin',
        email: 'admin@gmail.com',
        password: '123123',
        direccion: 'Avenida Siempre Viva 742',
        esAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuarios', null, {});
  }
};