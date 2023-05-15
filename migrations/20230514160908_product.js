exports.up = function (knex) {
  return knex.schema.createTable('products', function (table) {
    table.increments('id');
    table.string('name', 255).notNullable();
    table.string('price', 255).notNullable();
    table.string('description', 255).notNullable();
    table.integer('productsInStock', 255).notNullable();
    table.dateTime('createdTime').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('products');
};
