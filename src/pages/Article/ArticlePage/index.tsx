import { Navigate, useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import {
  ArticleSentence,
  ArticleSentenceForm,
  INITIAL_ARTICLE,
  State,
} from '../../../Model';
import { Action, ActionTypes } from '../../../Update';
import { getArticle } from '../../../services/article';
import TableLayout from '../../../components/templates/TableLayout';
import { Button } from '@mui/material';
import SentenceRow from './SentenceRow';
import {
  buildAccentQuizFromState,
  buildRhythmQuizFromState,
  createQuiz,
} from '../../../services/quiz';
import InitializeSentencesPane from './InitializeSentencesPane';
import { AppContext } from '../../../App';

const ArticlePage = () => {
  const { state, dispatch } = useContext(AppContext);
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [isSm, setIsSm] = useState(true);

  const { isFetching, memo, article, sentences } = state;

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
      let _articleBlob: Blob | null = null;

      const memoArticle = memo.articles[articleId];
      const memoSentences = memo.sentences[articleId];
      const memoArticleSentenceForms = memo.articleSentenceForms[articleId];
      const memoArticleBlob = memo.articleBlobs[articleId];

      if (
        memoArticle &&
        memoSentences &&
        memoArticleSentenceForms &&
        memoArticleBlob !== undefined
      ) {
        _article = memoArticle;
        _sentences = memoSentences;
        _articleSentenceForms = memoArticleSentenceForms;
        _articleBlob = memoArticleBlob;
      } else {
        const { article, sentences, articleSentenceForms, articleBlob } =
          await getArticle(articleId);
        _article = article;
        _sentences = sentences;
        _articleBlob = articleBlob;
        _articleSentenceForms = articleSentenceForms;
      }
      dispatch({
        type: ActionTypes.setArticle,
        payload: {
          article: _article,
          sentences: _sentences,
          articleBlob: _articleBlob,
          articleSentenceForms: _articleSentenceForms,
        },
      });
    };
    fetchData();
  }, [isFetching, articleId]);

  const handleCreateAccentQuiz = async () => {
    if (!dispatch) return;
    const { quiz, questionGroup, questions } = buildAccentQuizFromState(state);
    await createQuiz(quiz, questionGroup, questions);
    // debug
    // const updatedState= {}
    // dispatch({
    //   type: ActionTypes.setState , <- subumit
    //   payload: updatedState,
    // });
    navigate(`/accentsQuestion/${quiz.id}`);
  };

  const handleCreateRhythmQuiz = async () => {
    if (!dispatch) return;
    const { quiz, questionGroup, questions } = buildRhythmQuizFromState(state);
    await createQuiz(quiz, questionGroup, questions);
    // debug
    // const updatedState= {}
    // dispatch({
    //   type: ActionTypes.setState <- subumit
    //   payload: updatedState,
    // });
    navigate(`/rhythmsQuestion/${quiz.id}`);
  };

  // データ取得中
  if (isFetching) return <></>;
  // article が 初期値
  if (!article.id) return <Navigate to={'/article/list'} />;
  return (
    <TableLayout
      maxWidth={isSm ? 'sm' : 'md'}
      title={article.title}
      backURL={`/article/list`}
    >
      <div style={{ marginBottom: 16 }}>
        <Button size='small' variant='contained' onClick={() => setIsSm(!isSm)}>
          switch width
        </Button>
      </div>
      {!!sentences.length ? (
        <div style={{ display: 'grid', rowGap: 16 }}>
          {sentences.map((_, sentenceIndex) => (
            <SentenceRow
              key={sentenceIndex}
              isSm={isSm}
              sentenceIndex={sentenceIndex}
            />
          ))}

          <Button variant='contained' onClick={handleCreateAccentQuiz}>
            アクセント問題作成
          </Button>
          <Button variant='contained' onClick={handleCreateRhythmQuiz}>
            リズム問題作成
          </Button>
        </div>
      ) : (
        <InitializeSentencesPane />
      )}
    </TableLayout>
  );
};

export default ArticlePage;
