import { useContext } from 'react';

import { Sentence } from '../../../entities/Sentence';
import { SentenceInputContext } from '../../../sentence-input';

// OPTIMIZE これは context を分ける？
export const useHandleSentence = () => {
  const {
    onAddTopic,
    sentenceID,
    onAddComment,
    onRemoveTopic,
    onAddShuuJoshi,
    isLastSentence,
    globalSentences,
    isActiveSentence,
    onDeleteSentence,
    onRemoveShuuJoshi,
    onAddBuntouSeibun,
    onAddDoushiComment,
    onToggleJuntaiJoshi,
    onSetActiveSentence,
    onRemoveBuntouSeibuns,
    hasJuntaiJoshiBunmatsu,
    onAddJuntaiJoshiBunmatsu,
    onRemoveJuntaiJoshiBunmatsu,
  } = useContext(SentenceInputContext);

  const toggleBuntouSeibun = () => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    if (!isActiveSentence) return;
    if (!sentence.buntouSeibuns.length) {
      onAddBuntouSeibun();
    } else {
      onRemoveBuntouSeibuns();
    }
  };
  const toggleTopic = () => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    if (!isActiveSentence) return;
    if (!sentence.topic) {
      onAddTopic();
    } else {
      onRemoveTopic();
    }
  };
  const addComment = () => {
    if (!isActiveSentence) return;
    onAddComment();
  };
  const addDoushiComment = () => {
    if (!isActiveSentence) return;
    onAddDoushiComment();
  };
  const toggleJuntaiJoshi = () => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    if (!isActiveSentence) return;
    if (!sentence.comments.length || !isLastSentence) return;
    onToggleJuntaiJoshi();
  };
  const toggleJuntaiJoshiBunmatsu = () => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    if (!isActiveSentence) return;
    if (!sentence.juntaiJoshi) return;
    if (hasJuntaiJoshiBunmatsu) {
      onRemoveJuntaiJoshiBunmatsu();
    } else {
      onAddJuntaiJoshiBunmatsu();
    }
  };
  const toggleShuuJoshi = () => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    if (!isActiveSentence) return;
    if (!sentence.comments.length || !isLastSentence) return;
    if (!sentence.shuuJoshi) {
      onAddShuuJoshi();
    } else {
      onRemoveShuuJoshi();
    }
  };
  const deleteSentence = () => {
    if (!isActiveSentence) return;
    onDeleteSentence();
  };
  const focusLastSentence = () => {
    isLastSentence && onSetActiveSentence();
  };
  return [
    {
      key: 'ctrl+b',
      action: toggleBuntouSeibun,
    },
    {
      key: 'ctrl+t',
      action: toggleTopic,
    },
    {
      key: 'ctrl+c',
      action: addComment,
    },
    {
      key: 'shift+ctrl+c',
      action: addDoushiComment,
    },
    {
      key: 'ctrl+n',
      action: toggleJuntaiJoshi,
    },
    {
      key: 'ctrl+d',
      action: toggleJuntaiJoshiBunmatsu,
    },
    {
      key: 'ctrl+s',
      action: toggleShuuJoshi,
    },
    {
      key: 'ctrl+r',
      action: deleteSentence,
    },
    {
      key: 'ctrl+f',
      action: focusLastSentence,
    },
  ];
};
