import * as R from 'ramda';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import { Container, Divider } from '@mui/material';
import accentsForPitchesArray from 'accents-for-pitches-array';
import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../App';
import { ArticleSentence, INITIAL_ARTICLE, State } from '../../../Model';
import { getArticle } from '../../../services/article';

import { ActionTypes } from '../../../Update';

const PrintPitchesPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const { articleId } = useParams();
  if (!articleId) return <></>;

  const article = state.articles[articleId];
  if (!article) return <></>;

  useEffect(() => {
    if (!state.isFetching || !dispatch) return;

    const fetchData = async () => {
      let _sentences: ArticleSentence[] = [];

      if (state.sentences[articleId]) {
        _sentences = state.sentences[articleId];
      } else {
        const { sentences } = await getArticle(articleId);
        _sentences = sentences;
      }

      const updatedState = R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<ArticleSentence[], State>(
          ['sentences', articleId],
          _sentences
        )
      )(state);
      dispatch({
        type: ActionTypes.setState,
        payload: updatedState,
      });
    };
    fetchData();
  }, [state.isFetching, articleId]);

  if (state.isFetching) return <></>;

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
