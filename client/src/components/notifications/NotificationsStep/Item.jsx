// ... existing imports ...
import truncate from 'lodash/truncate';
import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';

import selectors from '../../../selectors';
import entryActions from '../../../entry-actions';
import { mentionMarkupToText } from '../../../utils/mentions';
import { isUserStatic } from '../../../utils/record-helpers';
import Paths from '../../../constants/Paths';
import { NotificationTypes } from '../../../constants/Enums';
import TimeAgo from '../../common/TimeAgo';
import UserAvatar from '../../users/UserAvatar';

import styles from './Item.module.scss';

const Item = React.memo(({ id, onClose }) => {
  const selectNotificationById = useMemo(() => selectors.makeSelectNotificationById(), []);
  const selectCreatorUserById = useMemo(() => selectors.makeSelectUserById(), []);
  const selectCardById = useMemo(() => selectors.makeSelectCardById(), []);

  // Need to get board and list to display the location
  const selectBoardById = useMemo(() => selectors.makeSelectBoardById(), []);
  const selectListById = useMemo(() => selectors.makeSelectListById(), []);

  const notification = useSelector((state) => selectNotificationById(state, id));

  const creatorUser = useSelector((state) =>
    notification.creatorUserId
      ? selectCreatorUserById(state, notification.creatorUserId)
      : { name: 'system', isSystem: true },
  );

  const card = useSelector((state) => selectCardById(state, notification.cardId));

  const listId = card ? card.listId : notification.data?.list?.id;
  const boardId = card ? card.boardId : notification.data?.board?.id;

  const list = useSelector((state) => selectListById(state, listId));
  const board = useSelector((state) => selectBoardById(state, boardId));

  const dispatch = useDispatch();
  const [t] = useTranslation();

  const handleReadClick = useCallback(() => {
    if (!notification.isRead) {
      dispatch(entryActions.deleteNotification(id));
    }
  }, [id, notification.isRead, dispatch]);

  let creatorUserName = t('system', 'System');
  if (creatorUser && !creatorUser.isSystem) {
    if (isUserStatic(creatorUser)) {
      creatorUserName = t(`common.${creatorUser.name}`, {
        context: 'title',
      });
    } else {
      creatorUserName = creatorUser.name;
    }
  }

  const cardName = card ? card.name : notification.data?.card?.name || '';
  const locationText = board && list ? `${board.name} > ${list.name}` : '';

  let actionTextNode;
  switch (notification.type) {
    case NotificationTypes.MOVE_CARD: {
      const { fromList, toList } = notification.data;
      const fromListName = fromList.name || t(`common.${fromList.type}`);
      const toListName = toList.name || t(`common.${toList.type}`);

      actionTextNode = (
        <Trans
          i18nKey="common.userMovedCardFromListToList"
          values={{
            user: creatorUserName,
            card: cardName,
            fromList: fromListName,
            toList: toListName,
          }}
        >
          <span className={styles.author}>{creatorUserName}</span>
          {' moved '}
          <Link
            to={Paths.CARDS.replace(':id', notification.cardId)}
            onClick={onClose}
            className={styles.cardLink}
          >
            {cardName}
          </Link>
          {` from ${fromListName} to ${toListName}`}
        </Trans>
      );
      break;
    }
    case NotificationTypes.COMMENT_CARD: {
      const commentText = truncate(mentionMarkupToText(notification.data.text));
      actionTextNode = (
        <>
          <Trans
            i18nKey="common.userLeftNewCommentToCard"
            values={{
              user: creatorUserName,
              comment: commentText,
              card: cardName,
            }}
          >
            <span className={styles.author}>{creatorUserName}</span>
            {` left a new comment  `}
            <Link
              to={Paths.CARDS.replace(':id', notification.cardId)}
              onClick={onClose}
              className={styles.cardLink}
            >
              {cardName}
            </Link>
          </Trans>
          <div className={styles.commentText}>&quot;{commentText}&quot;</div>
        </>
      );
      break;
    }
    case NotificationTypes.ADD_MEMBER_TO_CARD:
      actionTextNode = (
        <Trans
          i18nKey="common.userAddedYouToCard"
          values={{
            user: creatorUserName,
            card: cardName,
          }}
        >
          <span className={styles.author}>{creatorUserName}</span>
          {` added you to `}
          <Link
            to={Paths.CARDS.replace(':id', notification.cardId)}
            onClick={onClose}
            className={styles.cardLink}
          >
            {cardName}
          </Link>
        </Trans>
      );
      break;
    case NotificationTypes.MENTION_IN_COMMENT: {
      const commentText = truncate(mentionMarkupToText(notification.data.text));
      actionTextNode = (
        <>
          <Trans
            i18nKey="common.userMentionedYouInCommentOnCard"
            values={{
              user: creatorUserName,
              comment: commentText,
              card: cardName,
            }}
          >
            <span className={styles.author}>{creatorUserName}</span>
            {` mentioned you in a comment on `}
            <Link
              to={Paths.CARDS.replace(':id', notification.cardId)}
              onClick={onClose}
              className={styles.cardLink}
            >
              {cardName}
            </Link>
          </Trans>
          <div className={styles.commentText}>&quot;{commentText}&quot;</div>
        </>
      );
      break;
    }
    case NotificationTypes.DUE_DATE: {
      actionTextNode = (
        <Trans
          i18nKey="common.dueDateExpiredForCard"
          values={{
            card: cardName,
          }}
        >
          <span className={styles.author}>{creatorUserName}</span>
          {` due date expired for `}
          <Link
            to={Paths.CARDS.replace(':id', notification.cardId)}
            onClick={onClose}
            className={styles.cardLink}
          >
            {cardName}
          </Link>
        </Trans>
      );
      break;
    }
    default:
      actionTextNode = null;
  }

  return (
    <div
      className={`${styles.wrapper} ${!notification.isRead ? styles.unread : ''}`}
      onClick={handleReadClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleReadClick();
      }}
      role="button"
      tabIndex={0}
    >
      <div className={styles.avatarContainer}>
        {notification.creatorUserId ? (
          <UserAvatar id={notification.creatorUserId} size="large" />
        ) : (
          <div
            style={{
              background: '#34495e',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            S
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.textBody}>{actionTextNode}</div>

        {locationText && <div className={styles.location}>{locationText}</div>}

        <div className={styles.date}>
          <TimeAgo date={new Date(notification.createdAt)} />
        </div>
      </div>
      {!notification.isRead && <div className={styles.unreadIndicator} />}
    </div>
  );
});

Item.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Item;
