import React from 'react';
import { Button } from '@mui/material';
import { Article } from '../../../../../entities/Article';
import { Sentence } from '../../../../../entities/Sentence';
import { useSentenceParseForm } from '../services/sentenceParseForm';
// debug
// import ComplexSentenceInput from '@bit/chihatw.lang-gym.complex-sentence-input';
// import ComplexSentenceDrawer from '@bit/chihatw.lang-gym.complex-sentence-drawer';

const SentenceParseForm: React.FC<{ article: Article; sentence: Sentence }> = ({
  article,
  sentence,
}) => {
  const {
    onSubmit,
    sentenceID,
    globalUnits,
    globalWords,
    setGlobalUnits,
    setGlobalWords,
    globalBranches,
    globalSentences,
    activeSentenceID,
    sentenceParseNew,
    setGlobalBranches,
    setGlobalSentences,
    setActiveSentenceID,
    globalSentenceArrays,
    setGlobalSentenceArrays,
    globalBranchInvisibilities,
    globalCommentInvisibilities,
    setGlobalBranchInvisibilities,
    setGlobalCommentInvisibilities,
  } = useSentenceParseForm(article, sentence);
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
        under construction
        {/* <ComplexSentenceInput
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
        /> */}
      </div>
      <div style={{ height: 32 }} />
      <div>
        under construction
        {/* <ComplexSentenceDrawer
          globalUnits={globalUnits}
          globalWords={globalWords}
          setGlobalUnits={setGlobalUnits}
          setGlobalWords={setGlobalWords}
          globalBranches={globalBranches}
          globalSentences={globalSentences}
          setGlobalBranches={setGlobalBranches}
          setGlobalSentences={setGlobalSentences}
          isHideJoshiTooltip={true}
          globalSentenceArrays={globalSentenceArrays}
          setGlobalSentenceArrays={setGlobalSentenceArrays}
          globalBranchInvisibilities={globalBranchInvisibilities}
          globalCommentInvisibilities={globalCommentInvisibilities}
          setGlobalBranchInvisibilities={setGlobalBranchInvisibilities}
          setGlobalCommentInvisibilities={setGlobalCommentInvisibilities}
        /> */}
      </div>
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
