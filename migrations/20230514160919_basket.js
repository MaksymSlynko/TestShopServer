exports.up = function (knex) {
  return knex.schema.createTable('basket', function (table) {
    table.increments('id');
    table.integer('userId').notNullable();
    table.dateTime('createdTime').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('basket');
};
