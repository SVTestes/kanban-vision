/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

const { idInput } = require('../../../utils/inputs');

const Errors = {
  NOT_ENOUGH_RIGHTS: {
    notEnoughRights: 'Not enough rights',
  },
  CARD_RECURRENCE_NOT_FOUND: {
    cardRecurrenceNotFound: 'Card recurrence not found',
  },
};

module.exports = {
  inputs: {
    id: {
      ...idInput,
      required: true,
    },
  },

  exits: {
    notEnoughRights: {
      responseType: 'forbidden',
    },
    cardRecurrenceNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    const cardRecurrence = await CardRecurrence.findOne(inputs.id);

    if (!cardRecurrence) {
      throw Errors.CARD_RECURRENCE_NOT_FOUND;
    }

    const { board } = await sails.helpers.cards
      .getPathToProjectById(cardRecurrence.cardId)
      .intercept('pathNotFound', () => Errors.CARD_RECURRENCE_NOT_FOUND);

    const boardMembership = await BoardMembership.qm.getOneByBoardIdAndUserId(
      board.id,
      currentUser.id,
    );

    if (!boardMembership) {
      throw Errors.CARD_RECURRENCE_NOT_FOUND; // Forbidden
    }

    if (boardMembership.role !== BoardMembership.Roles.EDITOR) {
      throw Errors.NOT_ENOUGH_RIGHTS;
    }

    const deletedCardRecurrence = await sails.helpers.cardRecurrences.deleteOne.with({
      record: cardRecurrence,
      board,
      request: this.req,
    });

    if (!deletedCardRecurrence) {
      throw Errors.CARD_RECURRENCE_NOT_FOUND;
    }

    return {
      item: deletedCardRecurrence,
    };
  },
};
