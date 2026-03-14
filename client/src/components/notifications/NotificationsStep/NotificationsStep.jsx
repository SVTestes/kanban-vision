/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'semantic-ui-react';
import { Popup } from '../../../lib/custom-ui';

import selectors from '../../../selectors';
import entryActions from '../../../entry-actions';
import Item from './Item';

import styles from './NotificationsStep.module.scss';

const NotificationsStep = React.memo(({ onClose }) => {
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const allNotificationIds = useSelector(selectors.selectAllNotificationIdsForCurrentUser) || [];
  const unreadNotificationIds = useSelector(selectors.selectNotificationIdsForCurrentUser) || [];

  const displayIds = showUnreadOnly ? unreadNotificationIds : allNotificationIds;

  const dispatch = useDispatch();
  const [t] = useTranslation();

  const handleDeleteAllClick = useCallback(() => {
    dispatch(entryActions.deleteAllNotifications());
  }, [dispatch]);

  const handleToggleUnread = useCallback(() => {
    setShowUnreadOnly((prev) => !prev);
  }, []);

  return (
    <>
      <Popup.Header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            {t('common.notifications', {
              context: 'title',
            })}
          </span>
          {unreadNotificationIds.length > 0 && (
            <span
              className={styles.markAllRead}
              onClick={handleDeleteAllClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleDeleteAllClick();
              }}
              role="button"
              tabIndex={0}
            >
              {t('action.dismissAll', 'Mark all as read')}
            </span>
          )}
        </div>
      </Popup.Header>
      <Popup.Content>
        <div className={styles.filterToggle}>
          <Checkbox
            toggle
            label={t('action.showOnlyUnread', 'Mostrar apenas itens não lidos')}
            checked={showUnreadOnly}
            onChange={handleToggleUnread}
          />
        </div>
        {displayIds.length > 0 ? (
          <div className={styles.items}>
            {displayIds.map((notificationId) => (
              <Item key={notificationId} id={notificationId} onClose={onClose} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyMessage}>{t('common.noUnreadNotifications')}</div>
        )}
      </Popup.Content>
    </>
  );
});

NotificationsStep.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default NotificationsStep;
