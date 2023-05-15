exports.up = function (knex) {
  return knex.schema.createTable('orders', function (table) {
    table.increments('id');
    table.integer('userId').notNullable();
    table.json('orderDetails', 255).notNullable();
    table.decimal('totalPrice').notNullable();
    table.enu('status', ['created', 'sent', 'completed']).defaultTo('created');
    table.string('deliveryAddress', 255).notNullable();
    table.dateTime('createdTime').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('orders');
};
