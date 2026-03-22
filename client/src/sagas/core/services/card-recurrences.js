/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import { call, put, select } from 'redux-saga/effects';

import request from '../request';
import selectors from '../../../selectors';
import actions from '../../../actions';
import api from '../../../api';

export function* createCardRecurrence(cardId, data) {
  let cardRecurrence;
  try {
    ({ item: cardRecurrence } = yield call(request, api.createCardRecurrence, cardId, data));
  } catch (error) {
    yield put(actions.createCardRecurrence.failure(error));
    return;
  }

  yield put(actions.createCardRecurrence.success(cardRecurrence));
}

export function* createCardRecurrenceInCurrentCard(data) {
  const { cardId } = yield select(selectors.selectPath);

  yield call(createCardRecurrence, cardId, data);
}

export function* handleCardRecurrenceCreate(cardRecurrence) {
  yield put(actions.handleCardRecurrenceCreate(cardRecurrence));
}

export function* deleteCardRecurrence(id) {
  yield put(actions.deleteCardRecurrence(id));

  let cardRecurrence;
  try {
    ({ item: cardRecurrence } = yield call(request, api.deleteCardRecurrence, id));
  } catch (error) {
    yield put(actions.deleteCardRecurrence.failure(id, error));
    return;
  }

  yield put(actions.deleteCardRecurrence.success(cardRecurrence));
}

export function* handleCardRecurrenceDelete(cardRecurrence) {
  yield put(actions.handleCardRecurrenceDelete(cardRecurrence));
}

export default {
  createCardRecurrence,
  createCardRecurrenceInCurrentCard,
  handleCardRecurrenceCreate,
  deleteCardRecurrence,
  handleCardRecurrenceDelete,
};
