/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import { all, takeEvery } from 'redux-saga/effects';

import services from '../services';
import EntryActionTypes from '../../../constants/EntryActionTypes';

export default function* cardRecurrencesWatchers() {
  yield all([
    takeEvery(
      EntryActionTypes.CARD_RECURRENCE_IN_CURRENT_CARD_CREATE,
      ({ payload: { data } }) => services.createCardRecurrenceInCurrentCard(data),
    ),
    takeEvery(
      EntryActionTypes.CARD_RECURRENCE_CREATE_HANDLE,
      ({ payload: { cardRecurrence } }) => services.handleCardRecurrenceCreate(cardRecurrence),
    ),
    takeEvery(EntryActionTypes.CARD_RECURRENCE_DELETE, ({ payload: { id } }) =>
      services.deleteCardRecurrence(id),
    ),
    takeEvery(
      EntryActionTypes.CARD_RECURRENCE_DELETE_HANDLE,
      ({ payload: { cardRecurrence } }) => services.handleCardRecurrenceDelete(cardRecurrence),
    ),
  ]);
}
