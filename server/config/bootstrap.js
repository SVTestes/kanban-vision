/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

const moment = require('moment');

module.exports.bootstrap = async () => {
  // Check for due dates that have expired
  setInterval(async () => {
    try {
      const now = new Date();
      sails.log.verbose('Due date cron: checking at', now.toISOString());
      const cards = await Card.find({
        dueDate: { '<=': now },
        isDueCompleted: false,
      });

      if (cards.length === 0) {
        return;
      }

      sails.log.info('Due date cron: found', cards.length, 'card(s) with expired due dates');
      const webhooks = await Webhook.qm.getAll();

      await Promise.all(
        cards.map(async (card) => {
          try {
            const existingAction = await Action.findOne({
              cardId: card.id,
              type: Action.Types.DUE_DATE,
            });

            if (!existingAction) {
              const list = await List.findOne({ id: card.listId });
              if (!list) {
                sails.log.warn('Due date cron: list not found for card', card.id);
                return;
              }
              const board = await Board.findOne({ id: list.boardId });
              if (!board) {
                sails.log.warn('Due date cron: board not found for card', card.id);
                return;
              }
              const project = await Project.findOne({ id: board.projectId });
              if (!project) {
                sails.log.warn('Due date cron: project not found for card', card.id);
                return;
              }

              await sails.helpers.actions.createOne.with({
                values: {
                  card,
                  type: Action.Types.DUE_DATE,
                  data: {},
                  user: null,
                },
                project,
                board,
                list,
                webhooks,
              });
              sails.log.info(
                'Due date cron: created notification for card',
                card.id,
                '-',
                card.name,
              );
            }
          } catch (cardErr) {
            sails.log.error('Due date cron: error processing card', card.id, cardErr);
          }
        }),
      );
    } catch (err) {
      sails.log.error('Due date cron: error checking due dates:', err);
    }
  }, 60000); // 1 minute

  // Check for card recurrences
  setInterval(async () => {
    try {
      const now = new Date();
      sails.log.verbose('Card recurrence cron: checking at', now.toISOString());

      const recurrences = await CardRecurrence.find({
        nextRunAt: { '<=': now },
        isActive: true,
      });

      if (recurrences.length === 0) {
        return;
      }

      sails.log.info('Card recurrence cron: found', recurrences.length, 'due recurrences');

      await Promise.all(
        recurrences.map(async (recurrence) => {
          try {
            const card = await Card.qm.getOneById(recurrence.cardId);
            if (!card) {
              return; // Source card was deleted, maybe we should deactivate this recurrence
            }

            const targetList = await sails.models.list.findOne({ id: recurrence.targetListId });
            if (!targetList) {
              await CardRecurrence.updateOne({ id: recurrence.id })
                .set({ isActive: false });
              return;
            }

            const board = await sails.models.board.findOne({ id: targetList.boardId });
            const project = await sails.models.project.findOne({ id: board.projectId });
            const creatorUser = await sails.models.user.findOne({ id: card.creatorUserId });

            const sourceBoard = await sails.models.board.findOne({ id: card.boardId });
            if (!sourceBoard) return;
            const sourceProject = await sails.models.project.findOne({ id: sourceBoard.projectId });
            if (!sourceProject) return;
            const sourceList = await sails.models.list.findOne({ id: card.listId });
            if (!sourceList) return;

            const { card: newCard } = await sails.helpers.cards.duplicateOne.with({
              record: card,
              project: sourceProject,
              board: sourceBoard,
              list: sourceList,
              values: {
                project,
                board,
                list: targetList,
                creatorUser: creatorUser || (await sails.models.user.findOne({ isSuperAdmin: true })), // fallback
              },
            });

            // Calculate nextRunAt
            const nextRunAt = moment(recurrence.nextRunAt);
            switch (recurrence.frequency) {
              case 'daily':
                nextRunAt.add(recurrence.interval, 'days');
                break;
              case 'weekly':
                nextRunAt.add(recurrence.interval, 'weeks');
                break;
              case 'monthly':
                nextRunAt.add(recurrence.interval, 'months');
                break;
              case 'yearly':
                nextRunAt.add(recurrence.interval, 'years');
                break;
              default:
                break;
            }

            // If the frequency was too far in the past, fast forward it
            while (nextRunAt.isSameOrBefore(moment())) {
              switch (recurrence.frequency) {
                case 'daily':
                  nextRunAt.add(recurrence.interval, 'days');
                  break;
                case 'weekly':
                  nextRunAt.add(recurrence.interval, 'weeks');
                  break;
                case 'monthly':
                  nextRunAt.add(recurrence.interval, 'months');
                  break;
                case 'yearly':
                  nextRunAt.add(recurrence.interval, 'years');
                  break;
                default:
                  break;
              }
            }

            await CardRecurrence.updateOne({ id: recurrence.id }).set({
              nextRunAt: nextRunAt.toDate(),
            });

            sails.log.info('Card recurrence cron: duplicated card', card.id, 'to', newCard.id);
          } catch (recErr) {
            sails.log.error(
              'Card recurrence cron: error processing recurrence',
              recurrence.id,
              recErr,
            );
          }
        }),
      );
    } catch (err) {
      sails.log.error('Card recurrence cron: error:', err);
    }
  }, 60000); // 1 minute
};
