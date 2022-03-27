// debug
// import ComplexSentenceDrawer from '@bit/chihatw.lang-gym.complex-sentence-drawer';
import React, { useState } from 'react'; // useState
import {
  SentenceParseNew,
  Sentence as PSentence,
  Unit,
  Branch,
  Word,
} from '../../../../../entities/SentenceParseNew';

const ComplexSentenceDrawerWrapper: React.FC<{
  sentenceParseNew: SentenceParseNew;
}> = ({ sentenceParseNew }) => {
  // TODO sentenceParseNewを変換する
  const [globalSentences, setGlobalSentences] = useState<{
    [id: string]: PSentence;
  }>(sentenceParseNew.sentences);
  const [globalUnits, setGlobalUnits] = useState<{ [id: string]: Unit }>(
    sentenceParseNew.units
  );
  const [globalBranches, setGlobalBranches] = useState<{
    [id: string]: Branch;
  }>(sentenceParseNew.branches);
  const [globalWords, setGlobalWords] = useState<{ [id: string]: Word }>(
    sentenceParseNew.words
  );
  const [globalSentenceArrays, setGlobalSentenceArrays] = useState<string[][]>(
    sentenceParseNew.sentenceArrays
  );
  const [globalBranchInvisibilities, setGlobalBranchInvisibilities] = useState<
    string[]
  >(sentenceParseNew.branchInvisibilities);
  const [globalCommentInvisibilities, setGlobalCommentInvisibilities] =
    useState<string[]>(sentenceParseNew.commentInvisibilities);
  return (
    <div>under construction</div>
    // <ComplexSentenceDrawer
    //   globalUnits={globalUnits}
    //   globalWords={globalWords}
    //   setGlobalUnits={setGlobalUnits}
    //   setGlobalWords={setGlobalWords}
    //   globalBranches={globalBranches}
    //   globalSentences={globalSentences}
    //   setGlobalBranches={setGlobalBranches}
    //   setGlobalSentences={setGlobalSentences}
    //   isHideJoshiTooltip={true}
    //   globalSentenceArrays={globalSentenceArrays}
    //   setGlobalSentenceArrays={setGlobalSentenceArrays}
    //   globalBranchInvisibilities={globalBranchInvisibilities}
    //   globalCommentInvisibilities={globalCommentInvisibilities}
    //   setGlobalBranchInvisibilities={setGlobalBranchInvisibilities}
    //   setGlobalCommentInvisibilities={setGlobalCommentInvisibilities}
    // />
  );
};

export default ComplexSentenceDrawerWrapper;
