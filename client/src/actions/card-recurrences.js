/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import ActionTypes from '../constants/ActionTypes';

const createCardRecurrence = (cardId, data) => ({
  type: ActionTypes.CARD_RECURRENCE_CREATE,
  payload: {
    cardId,
    data,
  },
});

createCardRecurrence.success = (cardRecurrence) => ({
  type: ActionTypes.CARD_RECURRENCE_CREATE__SUCCESS,
  payload: {
    cardRecurrence,
  },
});

createCardRecurrence.failure = (error) => ({
  type: ActionTypes.CARD_RECURRENCE_CREATE__FAILURE,
  payload: {
    error,
  },
});

const handleCardRecurrenceCreate = (cardRecurrence) => ({
  type: ActionTypes.CARD_RECURRENCE_CREATE_HANDLE,
  payload: {
    cardRecurrence,
  },
});

const deleteCardRecurrence = (id) => ({
  type: ActionTypes.CARD_RECURRENCE_DELETE,
  payload: {
    id,
  },
});

deleteCardRecurrence.success = (cardRecurrence) => ({
  type: ActionTypes.CARD_RECURRENCE_DELETE__SUCCESS,
  payload: {
    cardRecurrence,
  },
});

deleteCardRecurrence.failure = (id, error) => ({
  type: ActionTypes.CARD_RECURRENCE_DELETE__FAILURE,
  payload: {
    id,
    error,
  },
});

const handleCardRecurrenceDelete = (cardRecurrence) => ({
  type: ActionTypes.CARD_RECURRENCE_DELETE_HANDLE,
  payload: {
    cardRecurrence,
  },
});

export default {
  createCardRecurrence,
  handleCardRecurrenceCreate,
  deleteCardRecurrence,
  handleCardRecurrenceDelete,
};
