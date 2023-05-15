exports.up = function (knex) {
    return knex.schema.createTable('basket_product_relations', function (table) {
      table.increments('id');
      table.integer('basketId').unsigned().references('basket.id').onDelete('CASCADE').notNullable();
      table.integer('productId').notNullable();
      table.integer('count').notNullable();
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('basket_product_relations');
  };
  