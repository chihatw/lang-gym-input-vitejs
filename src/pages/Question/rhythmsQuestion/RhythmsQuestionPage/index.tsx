import React from 'react';
import {
  RhythmsQuestionPageContext,
  useRhythmsQuestionPage,
} from './services/rhythmsQuestionPage';
import RhythmsQuestionForm from './components/RhythmsQuestionForm';
import TableLayout from '../../../../components/templates/TableLayout';

const RhythmsQuestionPage = () => {
  const {
    initializing,
    title,
    uid,
    users,
    audios,
    isAnswered,
    rhythmString,
    disabledsArray,
    sentenceRhythmArray,
    onSubmit,
    onChangeUid,
    onChangeTitle,
    onChangeDisabled,
    onChangeIsAnswered,
    onChangeRhythmString,
    onChangeWordDisabled,
    onDeleteSentence,
  } = useRhythmsQuestionPage();
  if (initializing) {
    return <></>;
  } else {
    return (
      <TableLayout title={title} backURL='/rhythmsQuestion/list'>
        <RhythmsQuestionPageContext.Provider
          value={{
            uid,
            users,
            audios,
            isAnswered,
            rhythmString,
            disabledsArray,
            sentenceRhythmArray,
            onSubmit,
            onChangeUid,
            onChangeTitle,
            onChangeDisabled,
            onChangeIsAnswered,
            onChangeRhythmString,
            onChangeWordDisabled,
            onDeleteSentence,
          }}
        >
          <RhythmsQuestionForm
            title={title}
            uid={uid}
            users={users}
            onChangeUid={onChangeUid}
            onChangeTitle={onChangeTitle}
            isAnswered={isAnswered}
            onChangeIsAnswered={onChangeIsAnswered}
            rhythmString={rhythmString}
            onChangeRhythmString={onChangeRhythmString}
            disabledsArray={disabledsArray}
            audios={audios}
            onSubmit={onSubmit}
          />
        </RhythmsQuestionPageContext.Provider>
      </TableLayout>
    );
  }
};

export default RhythmsQuestionPage;
