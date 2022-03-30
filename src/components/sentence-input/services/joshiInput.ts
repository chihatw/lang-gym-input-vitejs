import kakuJoshiTexts from 'kakujoshi-texts';
import kakariJoshiTexts from 'kakarijoshi-texts';
import { useContext, useEffect, useState } from 'react';

import { Word } from '../entities/Word';
import { Unit } from '../entities/Unit';
import { SentenceInputContext } from '../sentence-input';
import {
  Branch,
  RenyouJoshi,
  hasMeishiGrandParentUnit,
} from '../entities/Branch';

export const useJoshiInput = ({
  type,
  branchID,
}: {
  type: 'kakuJoshi' | 'kakariJoshi';
  branchID: string;
}) => {
  const { globalUnits, globalWords, globalBranches, onChangeSentence } =
    useContext(SentenceInputContext);

  const [value, setValue] = useState('');
  const [joshis, setJoshis] = useState<string[]>(['']);

  useEffect(() => {
    const branch: Branch | null = globalBranches[branchID];
    if (!branch) return;
    setValue((branch.joshi as RenyouJoshi)[type] || '');
  }, [globalBranches, type, branchID]);

  useEffect(() => {
    let joshis: string[] = [];
    const branch: Branch | null = globalBranches[branchID];
    if (!branch) return;
    const unit: Unit | null = globalUnits[branch.unitID];
    if (!unit) return;
    const word: Word | null = globalWords[unit.wordID];
    if (!word) return;
    if (type === 'kakuJoshi') {
      switch (word.hinshi) {
        case 'meishi':
        case 'jisuushi':
          joshis = [''].concat(Object.keys(kakuJoshiTexts));
          // 自身の祖父母Unitが名詞の場合、「の」を選択肢に含める
          hasMeishiGrandParentUnit({
            branchID,
            units: globalUnits,
            branches: globalBranches,
            words: globalWords,
          }) && (joshis = joshis.concat(['no']));
          break;
        case 'sentence':
          joshis = ['', 'to', 'wo', 'ni', 'ga'];
          break;
        case 'doushi':
          joshis = ['', 'ni', 'kara', 'made', 'madeni'];
          break;
        case 'hukushi':
          joshis = ['', 'to'];
          break;
        default:
          joshis = [''];
      }
    } else {
      joshis = [''].concat(Object.keys(kakariJoshiTexts));
    }
    setJoshis(joshis);
  }, [type, branchID, globalUnits, globalBranches, globalWords]);

  const onChangeValue = (joshi: string) => {
    const branch: Branch | null = globalBranches[branchID];
    if (!branch) return;
    setValue(joshi);
    let newJoshi = { ...(branch.joshi as RenyouJoshi) };
    if (type === 'kakuJoshi') {
      newJoshi = {
        kakuJoshi: joshi,
        kakariJoshi: ['ga', 'wo'].includes(joshi)
          ? ''
          : (branch.joshi as RenyouJoshi).kakariJoshi,
      };
    } else {
      const kakuJoshi = (branch.joshi as RenyouJoshi).kakuJoshi;
      newJoshi = {
        kakuJoshi:
          !!joshi && !!kakuJoshi && ['ga', 'wo'].includes(kakuJoshi)
            ? ''
            : (branch.joshi as RenyouJoshi).kakuJoshi,
        kakariJoshi: joshi,
      };
    }

    const newBranch = {
      ...branch,
      joshi: newJoshi,
    };
    const newBranches = {
      ...globalBranches,
      [branchID]: newBranch,
    };
    onChangeSentence({ newBranches });
  };

  return { joshis, value, onChangeValue };
};
