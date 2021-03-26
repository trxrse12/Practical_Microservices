exports.up = knex =>
  knex.schema.createTable('pages', table => {
    table.string('page_name').primary();
    tables.jsonb('page_data').defaultsTo('{}')
  });

exports.down = knex => knex.schema.dropTable('pages');