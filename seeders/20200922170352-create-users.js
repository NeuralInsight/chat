'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hash('123456',6)
    const createdAt = new Date()
    const updatedAt = createdAt

    await queryInterface.bulkInsert('Users',[
      {
        username: 'john',
        email: 'john@email.com',
        password: password,
        imageUrl:
              'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=656&q=80',
        createdAt,
        updatedAt,
      },
      {
        username: 'jane',
        email: 'jane@email.com',
        password: password,
        imageUrl:
            'https://images.unsplash.com/photo-1589329482108-e414c7c6b8c7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        createdAt,
        updatedAt,
      },
      {
        username: 'boss',
        email: 'boss@email.com',
        password: password,
        imageUrl:
            'https://images.unsplash.com/photo-1563240619-44ec0047592c?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        createdAt,
        updatedAt,
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
