import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@mui/material';

import sentenceParseNew2SentenceParseProps from 'sentence-parse-new2sentence-parse-props';
import { ComplexSentenceInput } from '../../../../components/complex-sentence-input';
import {
  ComplexSentencePane,
  ComplexSentencePaneProps,
} from '../../../../components/complex-sentence-pane';
import { Article } from '../../../../services/useArticles';
import { ArticleSentence } from '../../../../services/useSentences';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../services/app';
import {
  Branch,
  INITIAL_SENTENCE,
  Sentence,
  SentenceParseNew,
  Unit,
  useHandleSentenceParseNews,
  Word,
} from '../../../../services/useSentenceParseNews';
import { getUniqueStr } from '../../../../services/getUniqueStr';

const SentenceParseForm: React.FC<{
  article: Article;
  sentence: ArticleSentence;
}> = ({ article, sentence }) => {
  const navigate = useNavigate();
  const sentenceID = getUniqueStr();

  // useSentenceParseNews の snapshot を filter して取得、なければ初期値
  const { sentenceParseNew } = useContext(AppContext);

  const { createSentenceParseNew, updateSentenceParseNew } =
    useHandleSentenceParseNews();

  const [globalSentences, setGlobalSentences] = useState<{
    [id: string]: Sentence;
  }>({ [sentenceID]: { ...INITIAL_SENTENCE, id: sentenceID } });
  const [globalUnits, setGlobalUnits] = useState<{ [id: string]: Unit }>({});
  const [globalBranches, setGlobalBranches] = useState<{
    [id: string]: Branch;
  }>({});
  const [globalWords, setGlobalWords] = useState<{ [id: string]: Word }>({});
  const [globalSentenceArrays, setGlobalSentenceArrays] = useState<string[][]>([
    [sentenceID],
  ]);
  const [activeSentenceID, setActiveSentenceID] = useState(sentenceID);
  const [globalBranchInvisibilities, setGlobalBranchInvisibilities] = useState<
    string[]
  >([]);
  const [globalCommentInvisibilities, setGlobalCommentInvisibilities] =
    useState<string[]>([]);

  const [sentenceParseProps, setSentenceParseProps] = useState<
    Omit<ComplexSentencePaneProps, 'Cursor'>
  >({
    units: {},
    sentences: {},
    sentenceArrays: [],
  });

  useEffect(() => {
    if (!sentenceParseNew.id) return;
    setGlobalUnits(sentenceParseNew.units);
    setGlobalWords(sentenceParseNew.words);
    setGlobalBranches(sentenceParseNew.branches);
    setGlobalSentences(sentenceParseNew.sentences);
    setGlobalSentenceArrays(sentenceParseNew.sentenceArrays);
    setGlobalBranchInvisibilities(sentenceParseNew.branchInvisibilities);
    setGlobalCommentInvisibilities(sentenceParseNew.commentInvisibilities);
  }, [sentenceParseNew]);

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

  const onSubmit = async () => {
    // 初期値でない場合
    if (!!sentenceParseNew.id) {
      const _updateSentenceParse: SentenceParseNew = {
        ...sentenceParseNew,
        units: globalUnits,
        words: globalWords,
        branches: globalBranches,
        sentences: globalSentences,
        sentenceArrays: globalSentenceArrays,
        branchInvisibilities: globalBranchInvisibilities,
        commentInvisibilities: globalCommentInvisibilities,
      };
      const updatedItem = await updateSentenceParseNew(_updateSentenceParse);
      if (!!updatedItem) {
        navigate(`/article/${article.id}`);
      }
    }
    // 初期値の場合
    else {
      const newSentenceParse: Omit<SentenceParseNew, 'id'> = {
        line: sentence.line,
        article: article.id,
        sentence: sentence.id,
        units: globalUnits,
        words: globalWords,
        branches: globalBranches,
        sentences: globalSentences,
        sentenceArrays: globalSentenceArrays,
        branchInvisibilities: globalBranchInvisibilities,
        commentInvisibilities: globalCommentInvisibilities,
      };
      const createdItem = await createSentenceParseNew(newSentenceParse);
      if (!!createdItem) {
        navigate(`/article/${article.id}`);
      }
    }
  };

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
