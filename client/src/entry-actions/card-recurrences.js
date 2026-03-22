/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import EntryActionTypes from '../constants/EntryActionTypes';

const createCardRecurrenceInCurrentCard = (data) => ({
  type: EntryActionTypes.CARD_RECURRENCE_IN_CURRENT_CARD_CREATE,
  payload: {
    data,
  },
});

const handleCardRecurrenceCreate = (cardRecurrence) => ({
  type: EntryActionTypes.CARD_RECURRENCE_CREATE_HANDLE,
  payload: {
    cardRecurrence,
  },
});

const deleteCardRecurrence = (id) => ({
  type: EntryActionTypes.CARD_RECURRENCE_DELETE,
  payload: {
    id,
  },
});

const handleCardRecurrenceDelete = (cardRecurrence) => ({
  type: EntryActionTypes.CARD_RECURRENCE_DELETE_HANDLE,
  payload: {
    cardRecurrence,
  },
});

export default {
  createCardRecurrenceInCurrentCard,
  handleCardRecurrenceCreate,
  deleteCardRecurrence,
  handleCardRecurrenceDelete,
};
