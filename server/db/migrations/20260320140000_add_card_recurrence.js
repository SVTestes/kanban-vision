/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

exports.up = async (knex) => {
  return knex.schema.createTable('card_recurrence', (table) => {
    table.bigInteger('id').primary().defaultTo(knex.raw('next_id()'));

    table.bigInteger('card_id').notNullable();
    table.bigInteger('target_list_id').notNullable();
    table.string('frequency').notNullable();
    table.integer('interval').notNullable().defaultTo(1);
    table.timestamp('next_run_at', true).notNullable();
    table.boolean('is_active').notNullable().defaultTo(true);

    table.timestamp('created_at', true);
    table.timestamp('updated_at', true);
  });
};

exports.down = (knex) => knex.schema.dropTable('card_recurrence');
