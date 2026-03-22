/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

const defaultFind = (criteria) => CardRecurrence.find(criteria).sort('id');

/* Query methods */

const create = (arrayOfValues) => CardRecurrence.createEach(arrayOfValues).fetch();

const createOne = (values) => CardRecurrence.create({ ...values }).fetch();

const getByIds = (ids) => defaultFind(ids);

const getByCardIds = (cardIds) =>
  defaultFind({
    cardId: cardIds,
  });

const getOneById = (id) => CardRecurrence.findOne(id);

// eslint-disable-next-line no-underscore-dangle
const delete_ = (criteria) => CardRecurrence.destroy(criteria).fetch();

const deleteOne = (criteria) => CardRecurrence.destroyOne(criteria);

module.exports = {
  create,
  createOne,
  getByIds,
  getByCardIds,
  getOneById,
  deleteOne,
  delete: delete_,
};
