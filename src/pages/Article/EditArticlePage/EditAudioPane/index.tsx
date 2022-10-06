import * as R from 'ramda';
import React, { useContext } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { Button, Table, TableBody } from '@mui/material';
import { ArticleEditState } from '../Model';
import WaveCanvas from './WaveCanvas';
import MarksSlider from './MarksSlider';
import MarkRow from './MarkRow';
import { ArticleSentence, State } from '../../../../Model';
import { AppContext } from '../../../../App';
import { ActionTypes } from '../../../../Update';
import { setSentences } from '../../../../services/article';
import { useNavigate } from 'react-router-dom';

const EditAudioPane = ({
  state,
  dispatch,
  deleteAudio,
}: {
  state: ArticleEditState;
  dispatch: React.Dispatch<ArticleEditState>;
  deleteAudio: () => void;
}) => {
  const navigate = useNavigate();
  const { state: appState, dispatch: appDispatch } = useContext(AppContext);
  if (!state.audioContext || !state.blob) return <></>;
  const updateMarks = async () => {
    const newSentences: ArticleSentence[] = state.sentences.map(
      (senetence, index) => ({
        ...senetence,
        start: state.sentences[index].start,
        end: state.sentences[index].end,
      })
    );

    // update remote
    setSentences(newSentences);

    const updatedAppState = R.compose(
      R.assocPath<ArticleSentence[], State>(['sentences'], newSentences),
      R.assocPath<ArticleSentence[], State>(
        ['sentences', state.article.id],
        newSentences
      )
    )(appState);

    // update appState
    appDispatch({
      type: ActionTypes.setState,
      payload: updatedAppState,
    });

    // no update formState
    navigate(`/article/list`);
  };

  const originalSentences = appState.sentences[state.article.id];

  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <div style={{ color: 'green' }}>
        {!!originalSentences &&
          !!originalSentences[0] &&
          !!originalSentences[0].start && <CheckIcon />}
      </div>
      <WaveCanvas state={state} />
      <MarksSlider state={state} dispatch={dispatch} />
      <Button color='primary' variant='contained' onClick={deleteAudio}>
        音声削除
      </Button>
      <Table size='small'>
        <TableBody>
          {state.sentences.map((sentence, index) => (
            <MarkRow
              key={index}
              index={index}
              state={state}
              label={sentence.japanese.slice(0, 20)}
              dispatch={dispatch}
            />
          ))}
        </TableBody>
      </Table>
      <Button color='primary' variant='contained' onClick={updateMarks}>
        音声marks更新
      </Button>
    </div>
  );
};

export default EditAudioPane;
