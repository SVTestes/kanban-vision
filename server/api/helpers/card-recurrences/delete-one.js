/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

module.exports = {
  inputs: {
    record: {
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
    const cardRecurrences = await CardRecurrence.destroy({
      id: inputs.record.id,
    }).fetch();

    if (cardRecurrences.length > 0) {
      sails.sockets.broadcast(
        `board:${inputs.board.id}`,
        'cardRecurrenceDelete',
        {
          item: cardRecurrences[0],
        },
        inputs.request,
      );

      return cardRecurrences[0];
    }

    return null;
  },
};
