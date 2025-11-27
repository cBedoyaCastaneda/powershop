'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('Productos', [
      // 🧠 Telekinesis
      { nombre: 'Guantes Psiónicos', descripcion: '', precio: 1200, categoriaId: 1, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Casco Mentalis', descripcion: '', precio: 2200, categoriaId: 1, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Píldora Psicoactiva', descripcion: '', precio: 750, categoriaId: 1, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Anillo de Control Mental', descripcion: '', precio: 1600, categoriaId: 1, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Cristal de Levitar', descripcion: '', precio: 1900, categoriaId: 1, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Capa de Energía Mental', descripcion: '', precio: 1300, categoriaId: 1, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Amuleto de la Mente', descripcion: '', precio: 980, categoriaId: 1, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Visor Psíquico', descripcion: '', precio: 1450, categoriaId: 1, destacado: false, createdAt: now, updatedAt: now },

      // 🔥 Elementales
      { nombre: 'Guante de Fuego Infernal', descripcion: '', precio: 1700, categoriaId: 2, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Botas de Tierra Ancestral', descripcion: '', precio: 1100, categoriaId: 2, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Amuleto del Agua Eterna', descripcion: '', precio: 2100, categoriaId: 2, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Báculo de Tormentas', descripcion: '', precio: 2600, categoriaId: 2, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Píldora de Aire Vital', descripcion: '', precio: 890, categoriaId: 2, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Cinturón Magmático', descripcion: '', precio: 1750, categoriaId: 2, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Túnica de Hielo Puro', descripcion: '', precio: 1400, categoriaId: 2, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Collar del Rayo', descripcion: '', precio: 1550, categoriaId: 2, destacado: false, createdAt: now, updatedAt: now },

      // ⚡ Velocidad
      { nombre: 'Botas Relámpago', descripcion: '', precio: 1300, categoriaId: 3, destacado: true, createdAt: now, updatedAt: now },
      { nombre: 'Suero Acelerador', descripcion: '', precio: 950, categoriaId: 3, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Banda del Tiempo', descripcion: '', precio: 1800, categoriaId: 3, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Visor Cinético', descripcion: '', precio: 1250, categoriaId: 3, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Píldora de Reflejos', descripcion: '', precio: 800, categoriaId: 3, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Guantes de Fricción Cero', descripcion: '', precio: 1400, categoriaId: 3, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Traje Aerodinámico', descripcion: '', precio: 1900, categoriaId: 3, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Cristal del Tiempo', descripcion: '', precio: 2300, categoriaId: 3, destacado: false, createdAt: now, updatedAt: now },

      // 💪 Fuerza
      { nombre: 'Brazaletes Titánicos', descripcion: '', precio: 1750, categoriaId: 4, destacado: true, createdAt: now, updatedAt: now },
      { nombre: 'Píldora Muscular X', descripcion: '', precio: 950, categoriaId: 4, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Armadura de Poder Alfa', descripcion: '', precio: 2500, categoriaId: 4, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Guantes de Gigante', descripcion: '', precio: 1450, categoriaId: 4, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Anillo de Titanio Vivo', descripcion: '', precio: 1250, categoriaId: 4, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Poción de Coloso', descripcion: '', precio: 780, categoriaId: 4, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Cinturón Hércules', descripcion: '', precio: 1600, categoriaId: 4, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Botas del Golpe Sísmico', descripcion: '', precio: 1350, categoriaId: 4, destacado: false, createdAt: now, updatedAt: now },

      // 👻 Invisibilidad
      { nombre: 'Capa Fantasma', descripcion: '', precio: 1900, categoriaId: 5, destacado: true, createdAt: now, updatedAt: now },
      { nombre: 'Gafas de Desvanecer', descripcion: '', precio: 1200, categoriaId: 5, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Píldora del Velo', descripcion: '', precio: 850, categoriaId: 5, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Anillo Espectral', descripcion: '', precio: 1550, categoriaId: 5, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Pulsera Etérea', descripcion: '', precio: 1100, categoriaId: 5, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Perfume Traslúcido', descripcion: '', precio: 780, categoriaId: 5, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Traje Óptico', descripcion: '', precio: 2000, categoriaId: 5, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Cristal del Silencio', descripcion: '', precio: 1750, categoriaId: 5, destacado: false, createdAt: now, updatedAt: now },

      // 🌌 Teletransportación
      { nombre: 'Anillo Warp', descripcion: '', precio: 1800, categoriaId: 6, destacado: true, createdAt: now, updatedAt: now },
      { nombre: 'Píldora del Salto Espacial', descripcion: '', precio: 900, categoriaId: 6, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Guante de Portales', descripcion: '', precio: 1900, categoriaId: 6, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Cinturón Dimensional', descripcion: '', precio: 2100, categoriaId: 6, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Reloj de Fase Cuántica', descripcion: '', precio: 2300, categoriaId: 6, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Cristal de Salto Instantáneo', descripcion: '', precio: 1750, categoriaId: 6, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Túnica Warp', descripcion: '', precio: 1600, categoriaId: 6, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Báculo de Portales', descripcion: '', precio: 2500, categoriaId: 6, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Botas de Traslación', descripcion: '', precio: 1550, categoriaId: 6, destacado: false, createdAt: now, updatedAt: now },
      { nombre: 'Disco de Fase Rápida', descripcion: '', precio: 950, categoriaId: 6, destacado: false, createdAt: now, updatedAt: now },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Productos', null, {});
  }
};
