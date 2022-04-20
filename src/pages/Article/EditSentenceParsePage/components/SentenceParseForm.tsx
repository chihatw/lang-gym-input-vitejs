import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';

import { useSentenceParseForm } from '../services/sentenceParseForm';
import sentenceParseNew2SentenceParseProps from 'sentence-parse-new2sentence-parse-props';
import { ComplexSentenceInput } from '../../../../components/complex-sentence-input';
import {
  ComplexSentencePane,
  ComplexSentencePaneProps,
} from '../../../../components/complex-sentence-pane';
import { Article } from '../../../../services/useArticles';
import { ArticleSentence } from '../../../../services/useSentences';

const SentenceParseForm: React.FC<{
  article: Article;
  sentence: ArticleSentence;
}> = ({ article, sentence }) => {
  const {
    sentenceID,
    globalUnits,
    globalWords,
    globalBranches,
    globalSentences,
    activeSentenceID,
    sentenceParseNew,
    globalSentenceArrays,
    onSubmit,
    setGlobalUnits,
    setGlobalWords,
    setGlobalBranches,
    setGlobalSentences,
    setActiveSentenceID,
    setGlobalSentenceArrays,
  } = useSentenceParseForm(article, sentence);
  const [sentenceParseProps, setSentenceParseProps] = useState<
    Omit<ComplexSentencePaneProps, 'Cursor'>
  >({
    units: {},
    sentences: {},
    sentenceArrays: [],
  });
  useEffect(() => {
    const sentenceParseProps = sentenceParseNew2SentenceParseProps({
      words: globalWords,
      units: globalUnits,
      branches: globalBranches,
      sentences: globalSentences,
      sentenceArrays: globalSentenceArrays,
    });
    setSentenceParseProps({ ...sentenceParseProps });
  }, [
    globalWords,
    globalUnits,
    globalBranches,
    globalSentences,
    globalSentenceArrays,
  ]);
  return (
    <div>
      <div style={{ fontSize: 12, color: '#555', paddingLeft: 8 }}>
        <div>{`${sentence.line + 1}. ${sentence.japanese}`}</div>
        <div style={{ height: 4 }} />
        <div style={{ paddingLeft: '1em' }}>
          <div style={{ color: '#52a2aa' }}>{sentence.original}</div>
          <div style={{ color: 'orange' }}>{sentence.chinese}</div>
        </div>
      </div>
      <div style={{ height: 16 }} />
      <div>
        <ComplexSentenceInput
          sentenceID={sentenceID}
          globalUnits={globalUnits}
          globalWords={globalWords}
          setGlobalUnits={setGlobalUnits}
          setGlobalWords={setGlobalWords}
          globalBranches={globalBranches}
          globalSentences={globalSentences}
          activeSentenceID={activeSentenceID}
          setGlobalBranches={setGlobalBranches}
          setGlobalSentences={setGlobalSentences}
          setActiveSentenceID={setActiveSentenceID}
          globalSentenceArrays={globalSentenceArrays}
          setGlobalSentenceArrays={setGlobalSentenceArrays}
        />
      </div>
      <div style={{ height: 32 }} />
      {sentenceParseProps.sentenceArrays.length && (
        <div>
          <ComplexSentencePane
            Cursor={null}
            units={sentenceParseProps.units}
            sentences={sentenceParseProps.sentences}
            sentenceArrays={sentenceParseProps.sentenceArrays}
          />
        </div>
      )}
      <div style={{ height: 40 }} />
      <div>
        <Button variant='contained' onClick={onSubmit}>
          {!!sentenceParseNew ? '更新' : '作成'}
        </Button>
      </div>
    </div>
  );
};

export default SentenceParseForm;
