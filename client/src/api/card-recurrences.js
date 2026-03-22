/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import socket from './socket';

const createCardRecurrence = (cardId, data, headers) =>
  socket.post(`/cards/${cardId}/card-recurrences`, data, headers);

const deleteCardRecurrence = (id, headers) =>
  socket.delete(`/card-recurrences/${id}`, undefined, headers);

export default {
  createCardRecurrence,
  deleteCardRecurrence,
};
