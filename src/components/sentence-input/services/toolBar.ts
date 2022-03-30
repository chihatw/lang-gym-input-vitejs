import { useContext } from 'react';
import { SentenceInputContext } from '../sentence-input';

export const useToolBar = () => {
  const {
    onAddTopic,
    sentenceID,
    onAddComment,
    onAddShuuJoshi,
    isLastSentence,
    globalSentences,
    onDeleteSentence,
    onAddBuntouSeibun,
    onToggleJuntaiJoshi,
    onAddJuntaiJoshiBunmatsu,
  } = useContext(SentenceInputContext);

  const sentence = globalSentences[sentenceID];

  return {
    onDeleteSentence,
    isLastSentence,
    items: [
      { label: '文頭', shortcutKey: '^b', onClick: onAddBuntouSeibun },
      {
        label: '主題',
        shortcutKey: '^t',
        onClick: onAddTopic,
        disabled: !!sentence.topic,
      },
      { label: '説明', shortcutKey: '^c', onClick: onAddComment },
      {
        label: 'の',
        shortcutKey: '^n',
        onClick: onToggleJuntaiJoshi,
        disabled: !sentence.comments.length || !isLastSentence,
      },
      {
        label: 'の文末',
        shortcutKey: '^d',
        onClick: onAddJuntaiJoshiBunmatsu,
        disabled: !sentence.juntaiJoshi,
      },
      {
        label: '終助詞類',
        shortcutKey: '^s',
        onClick: onAddShuuJoshi,
        disabled:
          !sentence.comments.length || !!sentence.shuuJoshi || !isLastSentence,
      },
    ],
  };
};
