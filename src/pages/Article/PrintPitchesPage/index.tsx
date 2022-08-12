import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import { Container, Divider } from '@mui/material';
import accentsForPitchesArray from 'accents-for-pitches-array';
import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../App';
import {
  ArticleSentence,
  ArticleSentenceForm,
  INITIAL_ARTICLE,
  State,
} from '../../../Model';
import { getArticle } from '../../../services/article';

import { ActionTypes } from '../../../Update';

const PrintPitchesPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const { articleId } = useParams();
  const { isFetching, memo, sentences } = state;

  useEffect(() => {
    if (!isFetching || !dispatch) return;

    if (!articleId) {
      dispatch({
        type: ActionTypes.setArticle,
        payload: {
          article: INITIAL_ARTICLE,
          sentences: [],
          articleBlob: null,
          articleSentenceForms: [],
        },
      });
      return;
    }

    const fetchData = async () => {
      let _article = INITIAL_ARTICLE;
      let _sentences: ArticleSentence[] = [];
      let _articleSentenceForms: ArticleSentenceForm[] = [];

      const memoArticle = memo.articles[articleId];
      const memoSentences = memo.sentences[articleId];
      const memoArticleSentenceForms = memo.articleSentenceForms[articleId];

      if (memoArticle && memoSentences && memoArticleSentenceForms) {
        _article = memoArticle;
        _sentences = memoSentences;
        _articleSentenceForms = memoArticleSentenceForms;
      } else {
        const { article, sentences, articleSentenceForms } = await getArticle(
          articleId
        );
        _article = article;
        _sentences = sentences;
        _articleSentenceForms = articleSentenceForms;
      }

      dispatch({
        type: ActionTypes.setArticle,
        payload: {
          article: _article,
          sentences: _sentences,
          articleSentenceForms: _articleSentenceForms,
          articleBlob: null,
        },
      });
    };
    fetchData();
  }, [isFetching, articleId]);

  return (
    <Container sx={{ paddingTop: 5, width: '180mm' }}>
      <div style={{ display: 'grid', rowGap: 8 }}>
        {sentences.map((sentence) => (
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
