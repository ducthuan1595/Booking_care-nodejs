'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // return queryInterface.bulkInsert('Users', [{
    //   firstName: 'John',
    //   lastName: 'Doe',
    //   email: 'example@example.com',
    //   password: '151995',
    //   address: 'thanh hoa',
    //   gender: 1,
    //   roleId: 'R1',
    //   phoneNumber: '012345678',
    //   positionId: 'A1',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }]);
  },
  down: async (queryInterface, Sequelize) => {
    // return queryInterface.bulkDelete('Users', null, {});
  }

};
