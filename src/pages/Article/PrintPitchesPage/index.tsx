import * as R from 'ramda';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import { Container, Divider } from '@mui/material';
import accentsForPitchesArray from 'accents-for-pitches-array';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../App';
import { ArticleSentence, State } from '../../../Model';

import { ActionTypes } from '../../../Update';
import { getSentences } from '../../../services/article';

const PrintPitchesPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const { articleId } = useParams();
  const [initializing, setInitializing] = useState(true);

  if (!articleId) return <></>;

  useEffect(() => {
    if (!state.users.length) return;
    const fetchData = async () => {
      const sentences =
        state.sentences[articleId] ||
        (initializing ? await getSentences(articleId) : []);

      const updatedState = R.compose(
        R.assocPath<ArticleSentence[], State>(
          ['sentences', articleId],
          sentences
        )
      )(state);

      // update appState
      dispatch({
        type: ActionTypes.setState,
        payload: updatedState,
      });

      setInitializing(false);
    };
    fetchData();
  }, [articleId, state.users, initializing]);

  if (initializing) return <></>;

  return (
    <Container sx={{ paddingTop: 5, width: '180mm' }}>
      <div style={{ display: 'grid', rowGap: 8 }}>
        {state.sentences[articleId].map((sentence) => (
          <PitchesRow key={sentence.id} sentence={sentence} />
        ))}
      </div>
    </Container>
  );
};

export default PrintPitchesPage;

const PitchesRow = ({ sentence }: { sentence: ArticleSentence }) => {
  const { accents } = sentence;
  const pitchesArray = accentsForPitchesArray(accents);
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr' }}>
        <div style={{ fontSize: 11, paddingLeft: 4, paddingTop: 4 }}>
          {sentence.line + 1}
        </div>
        <SentencePitchLine pitchesArray={pitchesArray} />
      </div>
      <Divider />
    </>
  );
};
