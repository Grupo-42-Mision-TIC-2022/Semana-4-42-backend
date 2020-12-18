'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Articulos', [{
            nombre: 'articulo_test',
            descripcion: 'lorem limpsus',
            codigo: '2222',
            precio_venta: 2525,
            stock: 25,
            categoriaId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },

    down: async(queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Articulos', null, {});

    }
};
