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
              sails.log.info('Due date cron: created notification for card', card.id, '-', card.name);
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
};
