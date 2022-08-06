import { SentenceFormInput } from '@chihatw/sentence-form.sentence-form-input';
import { SentenceFormPane } from '@chihatw/sentence-form.sentence-form-pane';
import { Button } from '@mui/material';

import { FSentences } from 'fsentence-types';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fsentences2String } from 'sentence-form-string';
import { ArticleSentenceForm, State } from '../../../Model';
import { setArticleSentenceForm } from '../../../services/article';

import { Action, ActionTypes } from '../../../Update';

const SentenceForm = ({
  state,
  dispatch,
  sentenceIndex,
}: {
  state: State;
  sentenceIndex: number;
  dispatch: React.Dispatch<Action>;
}) => {
  const { articleSentenceForms, sentences: _sentences, article } = state;
  const { id: articleId } = article;
  const sentence = _sentences[sentenceIndex];
  const { japanese, chinese, original } = sentence;

  const navigate = useNavigate();
  const articleSentenceForm = articleSentenceForms[sentenceIndex];

  const [sentences, setSentences] = useState<FSentences>({});
  const [sentenceFormStr, setSentenceFormStr] = useState('');

  useEffect(() => {
    if (!articleSentenceForms.length) return;
    const articleSentenceForm = articleSentenceForms[sentenceIndex];
    if (!!articleSentenceForm && !!articleSentenceForm.sentences) {
      const { sentences } = articleSentenceForm;
      setSentences(sentences);
      const sentenceFormStr = fsentences2String(sentences);
      setSentenceFormStr(sentenceFormStr);
    }
  }, [articleSentenceForms, sentenceIndex]);

  const handleAdd = async () => {
    const articleSentenceForm: ArticleSentenceForm = {
      id: nanoid(8),
      lineIndex: sentenceIndex,
      articleId: articleId,
      sentences,
    };
    dispatch({
      type: ActionTypes.setArticleSentenceForm,
      payload: { articleId, sentenceIndex, articleSentenceForm },
    });
    await setArticleSentenceForm(articleSentenceForm);
    navigate(`/article/${articleId}`);
  };
  const handleUpdate = async () => {
    const updatedArticleSentenceForm: ArticleSentenceForm = {
      ...articleSentenceForm,
      sentences,
    };

    dispatch({
      type: ActionTypes.setArticleSentenceForm,
      payload: {
        articleId,
        sentenceIndex,
        articleSentenceForm: updatedArticleSentenceForm,
      },
    });
    await setArticleSentenceForm(updatedArticleSentenceForm);
    navigate(`/article/${articleId}`);
  };

  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <div style={{ fontSize: 12, color: '#555', paddingLeft: 8 }}>
        <div>{`${sentenceIndex + 1}. ${japanese}`}</div>
        <div style={{ height: 4 }} />
        <div style={{ paddingLeft: '1em' }}>
          <div style={{ color: '#52a2aa' }}>{original}</div>
          <div style={{ color: 'orange' }}>{chinese}</div>
        </div>
      </div>
      <SentenceFormInput setSentences={setSentences} text={sentenceFormStr} />
      <SentenceFormPane sentences={sentences} />
      {!!articleSentenceForm && !!articleSentenceForm.sentences ? (
        <Button sx={{ justifyContent: 'flex-start' }} onClick={handleUpdate}>
          更新
        </Button>
      ) : (
        <Button sx={{ justifyContent: 'flex-start' }} onClick={handleAdd}>
          作成
        </Button>
      )}
    </div>
  );
};

export default SentenceForm;
