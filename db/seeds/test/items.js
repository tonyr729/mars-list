exports.seed = function(knex, Promise) {
  return knex('items').del()
    .then(function () {
      return knex('items').insert([
        {name: 'Oxygenator', isPacked: false},
        {name: 'Water Reclaimer', isPacked: false},
        {name: 'Solar Cells', isPacked: false}
      ]);
    });
};
