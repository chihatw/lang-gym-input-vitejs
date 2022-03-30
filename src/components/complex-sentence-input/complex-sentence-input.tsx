import React from 'react';
import SentenceArrayInput from './components/SentenceArrayInput';
import { ComplexSentenceInputContext } from './services/context';
import { Unit } from './entities/Unit';
import { Word } from './entities/Word';
import { Branch } from './entities/Branch';
import { Sentence } from './entities/Sentence';

export type ComplexSentenceInputProps = {
  sentenceID: string;
  globalUnits: { [id: string]: Unit };
  globalWords: { [id: string]: Word };
  setGlobalUnits: React.Dispatch<React.SetStateAction<{ [id: string]: Unit }>>;
  setGlobalWords: React.Dispatch<React.SetStateAction<{ [id: string]: Word }>>;
  globalBranches: { [id: string]: Branch };
  globalSentences: { [id: string]: Sentence };
  activeSentenceID: string;
  setGlobalBranches: React.Dispatch<
    React.SetStateAction<{ [id: string]: Branch }>
  >;
  setGlobalSentences: React.Dispatch<
    React.SetStateAction<{ [id: string]: Sentence }>
  >;
  setActiveSentenceID: React.Dispatch<React.SetStateAction<string>>;
  globalSentenceArrays: string[][];
  setGlobalSentenceArrays: React.Dispatch<React.SetStateAction<string[][]>>;
};

export function ComplexSentenceInput({
  sentenceID,
  globalUnits,
  globalWords,
  setGlobalUnits,
  setGlobalWords,
  globalBranches,
  globalSentences,
  activeSentenceID,
  setGlobalBranches,
  setGlobalSentences,
  setActiveSentenceID,
  globalSentenceArrays,
  setGlobalSentenceArrays,
}: ComplexSentenceInputProps) {
  const [mainSentenceArray, ...subSentenceArrays] = globalSentenceArrays;
  if (!!mainSentenceArray) {
    return (
      <ComplexSentenceInputContext.Provider
        value={{
          sentenceID,
          globalUnits,
          globalWords,
          setGlobalUnits,
          setGlobalWords,
          globalBranches,
          globalSentences,
          activeSentenceID,
          setGlobalBranches,
          setGlobalSentences,
          setActiveSentenceID,
          globalSentenceArrays,
          setGlobalSentenceArrays,
        }}
      >
        <div>
          <SentenceArrayInput sentenceArray={mainSentenceArray} />
          {!!subSentenceArrays.length && (
            <>
              <div style={{ height: 12 }} />
              <div style={{ display: 'flex' }}>
                <div>
                  {subSentenceArrays.map((sentenceArray, index) => (
                    <div key={sentenceArray[0]}>
                      <div
                        style={{
                          padding: 4,
                          borderRadius: 4,
                          backgroundColor: '#edf4e0',
                        }}
                      >
                        <SentenceArrayInput sentenceArray={sentenceArray} />
                      </div>
                      {!!subSentenceArrays[index + 1] && (
                        <div style={{ height: 8 }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </ComplexSentenceInputContext.Provider>
    );
  } else {
    return <></>;
  }
}
