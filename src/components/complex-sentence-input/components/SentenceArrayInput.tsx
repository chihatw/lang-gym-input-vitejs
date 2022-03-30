import { Button } from '@mui/material';
import React, { useContext } from 'react';

import { Sentence } from '../entities/Sentence';
import { useSentenceArrayInput } from '../services/sentenceArrayInput';
import { ComplexSentenceInputContext } from '../services/context';
import { SentenceInput } from '../../sentence-input';
const COLOR = '#739433';

const SentenceArrayInput: React.FC<{ sentenceArray: string[] }> = ({
  sentenceArray,
}) => {
  const {
    onAddSentence,
    onAddSubSentence,
    hasAddSentnceButton,
    hasAddSubSentnceButton,
  } = useSentenceArrayInput(sentenceArray);
  const {
    globalUnits,
    globalWords,
    setGlobalWords,
    setGlobalUnits,
    globalBranches,
    globalSentences,
    activeSentenceID,
    setGlobalBranches,
    setGlobalSentences,
    setActiveSentenceID,
    globalSentenceArrays,
    setGlobalSentenceArrays,
  } = useContext(ComplexSentenceInputContext);
  if (!!sentenceArray) {
    return (
      <div>
        {sentenceArray.map((sentenceID, index) => {
          const sentence: Sentence | null = globalSentences[sentenceID];
          if (!!sentence) {
            return (
              <div key={sentenceID}>
                <div style={{ display: 'flex' }}>
                  <div>
                    <SentenceInput
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
                </div>
                {(!!sentenceArray[index + 1] || hasAddSentnceButton) && (
                  <div style={{ height: 8 }} />
                )}
              </div>
            );
          }
          return <div key={sentenceID} />;
        })}
        <div style={{ display: 'flex', marginTop: 8 }}>
          {hasAddSentnceButton && (
            <>
              <Button
                variant='contained'
                onClick={onAddSentence}
                style={{ backgroundColor: '#00A89D', color: 'white' }}
              >
                文追加
              </Button>
              <div style={{ width: 8 }} />
            </>
          )}
          {hasAddSubSentnceButton && (
            <Button
              variant='contained'
              style={{ backgroundColor: COLOR, color: 'white' }}
              onClick={onAddSubSentence}
            >
              解説用
            </Button>
          )}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default SentenceArrayInput;
