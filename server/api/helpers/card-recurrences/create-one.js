/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

const moment = require('moment');

module.exports = {
  inputs: {
    values: {
      type: 'ref',
      required: true,
    },
    board: {
      type: 'ref',
      required: true,
    },
    request: {
      type: 'ref',
    },
  },

  exits: {},

  async fn(inputs) {
    const { values } = inputs;

    // Calculate nextRunAt roughly for the next schedule
    const nextRunAt = moment().startOf('day');
    switch (values.frequency) {
      case 'daily':
        nextRunAt.add(values.interval, 'days');
        break;
      case 'weekly':
        nextRunAt.add(values.interval, 'weeks');
        break;
      case 'monthly':
        nextRunAt.add(values.interval, 'months');
        break;
      case 'yearly':
        nextRunAt.add(values.interval, 'years');
        break;
    }

    const cardRecurrence = await CardRecurrence.create({
      ...values,
      nextRunAt: nextRunAt.toDate(),
      active: true,
    }).fetch();

    sails.sockets.broadcast(
      `board:${inputs.board.id}`,
      'cardRecurrenceCreate',
      {
        item: cardRecurrence,
      },
      inputs.request,
    );

    return cardRecurrence;
  },
};
