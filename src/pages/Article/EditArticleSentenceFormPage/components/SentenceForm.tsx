import { SentenceFormInput } from '@chihatw/sentence-form.sentence-form-input';
import { SentenceFormPane } from '@chihatw/sentence-form.sentence-form-pane';
import { Button } from '@mui/material';

import { FSentences } from 'fsentence-types';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fsentences2String } from 'sentence-form-string';
import { AppContext } from '../../../../services/app';
import {
  ArticleSentenceForm,
  useHandleArticleSentenceForms,
} from '../../../../services/useArticleSentenceForms';
import { ArticleSentence } from '../../../../services/useSentences';

const SentenceForm = ({
  lineIndex,
  sentence,
}: {
  lineIndex: number;
  sentence: ArticleSentence;
}) => {
  const navigate = useNavigate();
  const { articleSentenceForms, article } = useContext(AppContext);
  const articleSentenceForm = articleSentenceForms[lineIndex];
  const { addArticleSentenceForm, updateArticleSentenceForm } =
    useHandleArticleSentenceForms();

  const [sentences, setSentences] = useState<FSentences>({});
  const [sentenceFormStr, setSentenceFormStr] = useState('');

  useEffect(() => {
    if (!articleSentenceForms.length) return;
    const articleSentenceForm = articleSentenceForms[lineIndex];
    if (!!articleSentenceForm) {
      const { sentences } = articleSentenceForm;
      setSentences(sentences);
      const sentenceFormStr = fsentences2String(sentences);
      setSentenceFormStr(sentenceFormStr);
    }
  }, [articleSentenceForms, lineIndex]);

  const handleAdd = async () => {
    const newArticleSentenceForm: Omit<ArticleSentenceForm, 'id'> = {
      lineIndex,
      articleId: article.id,
      sentences,
    };
    const result = await addArticleSentenceForm(newArticleSentenceForm);
    if (result) {
      navigate(`/article/${sentence.article}`);
    }
  };
  const handleUpdate = async () => {
    const newSrticleSentenceForm: ArticleSentenceForm = {
      ...articleSentenceForm,
      sentences,
    };
    const result = await updateArticleSentenceForm(newSrticleSentenceForm);
    if (result) {
      navigate(`/article/${sentence.article}`);
    }
  };

  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <div style={{ fontSize: 12, color: '#555', paddingLeft: 8 }}>
        <div>{`${sentence.line + 1}. ${sentence.japanese}`}</div>
        <div style={{ height: 4 }} />
        <div style={{ paddingLeft: '1em' }}>
          <div style={{ color: '#52a2aa' }}>{sentence.original}</div>
          <div style={{ color: 'orange' }}>{sentence.chinese}</div>
        </div>
      </div>
      <SentenceFormInput
        setSentences={setSentences}
        text={sentenceFormStr || undefined}
      />
      <SentenceFormPane sentences={sentences} />
      {articleSentenceForm ? (
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
