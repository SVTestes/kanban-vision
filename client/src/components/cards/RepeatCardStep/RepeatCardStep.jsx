/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Form, Input } from 'semantic-ui-react';
import { Popup } from '../../../lib/custom-ui';

import selectors from '../../../selectors';
import entryActions from '../../../entry-actions';
import { useForm } from '../../../hooks';

import styles from './RepeatCardStep.module.scss';

const RepeatCardStep = React.memo(({ id, onBack, onClose }) => {
  const selectCardById = useMemo(() => selectors.makeSelectCardById(), []);
  const selectBoardById = useMemo(() => selectors.makeSelectBoardById(), []);

  const projectsToLists = useSelector(
    selectors.selectProjectsToListsWithEditorRightsForCurrentUser,
  );

  const card = useSelector((state) => selectCardById(state, id));
  const projectId = useSelector((state) => selectBoardById(state, card.boardId).projectId);

  const dispatch = useDispatch();
  const [t] = useTranslation();

  const defaultPath = useMemo(
    () => ({
      projectId,
      boardId: card.boardId,
      listId: card.listId,
      frequency: 'daily',
      interval: 1,
    }),
    [card.boardId, card.listId, projectId],
  );

  const [data, handleFieldChange] = useForm(() => ({
    ...defaultPath,
  }));

  const selectedProject = useMemo(
    () => projectsToLists.find((project) => project.id === data.projectId) || null,
    [projectsToLists, data.projectId],
  );

  const selectedBoard = useMemo(
    () =>
      (selectedProject && selectedProject.boards.find((board) => board.id === data.boardId)) ||
      null,
    [selectedProject, data.boardId],
  );

  const selectedList = useMemo(
    () => (selectedBoard && selectedBoard.lists.find((list) => list.id === data.listId)) || null,
    [selectedBoard, data.listId],
  );

  const handleSubmit = useCallback(() => {
    dispatch(
      entryActions.createCardRecurrenceInCurrentCard({
        targetListId: selectedList.id,
        frequency: data.frequency,
        interval: parseInt(data.interval, 10),
      }),
    );

    onClose();
  }, [dispatch, selectedList, data.frequency, data.interval, onClose]);

  const handleBoardIdChange = useCallback(
    (event, dropdownData) => {
      if (
        selectedProject.boards.find((board) => board.id === dropdownData.value).isFetching === null
      ) {
        dispatch(entryActions.fetchBoard(dropdownData.value));
      }

      handleFieldChange(event, dropdownData);
    },
    [dispatch, handleFieldChange, selectedProject],
  );

  const frequencyOptions = useMemo(
    () => [
      { text: t('common.daily'), value: 'daily' },
      { text: t('common.weekly'), value: 'weekly' },
      { text: t('common.monthly'), value: 'monthly' },
      { text: t('common.yearly'), value: 'yearly' },
    ],
    [t],
  );

  return (
    <>
      <Popup.Header onBack={onBack}>{t('common.repeatCard')}</Popup.Header>
      <Popup.Content>
        <Form onSubmit={handleSubmit}>
          <div className={styles.text}>{t('common.project')}</div>
          <Dropdown
            fluid
            selection
            name="projectId"
            options={projectsToLists.map((project) => ({
              text: project.name,
              value: project.id,
            }))}
            value={selectedProject && selectedProject.id}
            placeholder={
              projectsToLists.length === 0 ? t('common.noProjects') : t('common.selectProject')
            }
            disabled={projectsToLists.length === 0}
            className={styles.field}
            onChange={handleFieldChange}
          />
          {selectedProject && (
            <>
              <div className={styles.text}>{t('common.board')}</div>
              <Dropdown
                fluid
                selection
                name="boardId"
                options={selectedProject.boards.map((board) => ({
                  text: board.name,
                  value: board.id,
                }))}
                value={selectedBoard && selectedBoard.id}
                placeholder={
                  selectedProject.boards.length === 0
                    ? t('common.noBoards')
                    : t('common.selectBoard')
                }
                disabled={selectedProject.boards.length === 0}
                className={styles.field}
                onChange={handleBoardIdChange}
              />
            </>
          )}
          {selectedBoard && (
            <>
              <div className={styles.text}>{t('common.list')}</div>
              <Dropdown
                fluid
                selection
                name="listId"
                options={selectedBoard.lists.map((list) => ({
                  text: list.name || t(`common.${list.type}`),
                  value: list.id,
                  disabled: !list.isPersisted,
                }))}
                value={selectedList && selectedList.id}
                placeholder={
                  selectedBoard.isFetching === false && selectedBoard.lists.length === 0
                    ? t('common.noLists')
                    : t('common.selectList')
                }
                loading={selectedBoard.isFetching !== false}
                disabled={selectedBoard.isFetching !== false || selectedBoard.lists.length === 0}
                className={styles.field}
                onChange={handleFieldChange}
              />
            </>
          )}

          <div className={styles.text}>{t('common.frequency')}</div>
          <Dropdown
            fluid
            selection
            name="frequency"
            options={frequencyOptions}
            value={data.frequency}
            className={styles.field}
            onChange={handleFieldChange}
          />

          <div className={styles.text}>{t('common.interval')}</div>
          <Input
            fluid
            type="number"
            name="interval"
            min={1}
            value={data.interval}
            className={styles.field}
            onChange={handleFieldChange}
          />

          <Button
            positive
            content={t('action.save')}
            disabled={
              (selectedBoard && selectedBoard.isFetching !== false) ||
              !selectedList ||
              !data.interval ||
              parseInt(data.interval, 10) < 1
            }
          />
        </Form>
      </Popup.Content>
    </>
  );
});

RepeatCardStep.propTypes = {
  id: PropTypes.string.isRequired,
  onBack: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

RepeatCardStep.defaultProps = {
  onBack: undefined,
};

export default RepeatCardStep;
