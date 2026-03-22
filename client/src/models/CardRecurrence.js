/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import { attr, fk } from 'redux-orm';

import BaseModel from './BaseModel';
import ActionTypes from '../constants/ActionTypes';

export default class extends BaseModel {
  static modelName = 'CardRecurrence';

  static fields = {
    id: attr(),
    frequency: attr(),
    interval: attr(),
    active: attr(),
    nextRunAt: attr(),
    createdAt: attr({
      getDefault: () => new Date(),
    }),
    cardId: fk({
      to: 'Card',
      as: 'card',
      relatedName: 'recurrences',
    }),
    targetListId: fk({
      to: 'List',
      as: 'targetList',
      relatedName: 'recurrencesAsTarget',
    }),
  };

  static reducer({ type, payload }, CardRecurrence) {
    switch (type) {
      case ActionTypes.SOCKET_RECONNECT_HANDLE:
        CardRecurrence.all().delete();

        break;
      case ActionTypes.CARDS_FETCH__SUCCESS:
      case ActionTypes.BOARD_FETCH__SUCCESS:
      case ActionTypes.LIST_CARDS_MOVE__SUCCESS:
      case ActionTypes.LIST_DELETE_HANDLE:
      case ActionTypes.CARDS_UPDATE_HANDLE:
        if (payload.cardRecurrences) {
          payload.cardRecurrences.forEach((recurrence) => {
            CardRecurrence.upsert(recurrence);
          });
        }

        break;
      case ActionTypes.CARD_RECURRENCE_CREATE_HANDLE:
      case ActionTypes.CARD_RECURRENCE_CREATE__SUCCESS:
        CardRecurrence.upsert(payload.cardRecurrence);

        break;
      case ActionTypes.CARD_RECURRENCE_DELETE:
      case ActionTypes.CARD_RECURRENCE_DELETE__SUCCESS:
      case ActionTypes.CARD_RECURRENCE_DELETE_HANDLE: {
        const id = payload.cardRecurrence ? payload.cardRecurrence.id : payload.id;
        const model = CardRecurrence.withId(id);

        if (model) {
          model.delete();
        }

        break;
      }
      default:
    }
  }
}
