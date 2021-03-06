import { Navigate, useNavigate } from 'react-router-dom';
import React, { useContext, useState } from 'react';

import ArticlePageComponent from './components/ArticlePageComponent';
import { useHandleQuestions } from '../../../services/useQuestions';
import {
  QuestionGroup,
  useHandleQuestionGroups,
} from '../../../services/useQuestionGroups';
import { useHandleQuestionSets } from '../../../services/useQuestionSets';
import { AppContext } from '../../../services/app';

const ArticlePage = () => {
  const navigate = useNavigate();
  const { setQuestionSetId } = useContext(AppContext);

  const { createAccentsQuestions, createRhythmQuestions } =
    useHandleQuestions();
  const { createInitialQuestionGroup, updateQuestionGroup } =
    useHandleQuestionGroups();
  const { createAccentsQuestionSet, createRhythmQuestionSet } =
    useHandleQuestionSets();

  const { article, sentences, sentenceParseNews } = useContext(AppContext);

  const [isSm, setIsSm] = useState(true);

  const handleClickWidthButton = () => {
    setIsSm(!isSm);
  };

  const copySentenceParseNew = async (index: number) => {
    const sentence = sentences[index];
    const sentenceParseNew = sentenceParseNews[index];
    const item: {
      line: number;
      japanese: string;
      chinese: string;
      units: string;
      words: string;
      branches: string;
      sentences: string;
      sentenceArrays: string;
      branchInvisibilities: string;
      commentInvisibilities: string;
    } = {
      line: sentenceParseNew.line + 1,
      japanese: sentence.japanese,
      chinese: sentence.chinese,
      units: JSON.stringify(sentenceParseNew.units),
      words: JSON.stringify(sentenceParseNew.words),
      branches: JSON.stringify(sentenceParseNew.branches),
      sentences: JSON.stringify(sentenceParseNew.sentences),
      sentenceArrays: JSON.stringify(sentenceParseNew.sentenceArrays),
      branchInvisibilities: JSON.stringify(
        sentenceParseNew.branchInvisibilities
      ),
      commentInvisibilities: JSON.stringify(
        sentenceParseNew.commentInvisibilities
      ),
    };
    await navigator.clipboard.writeText(JSON.stringify(item));
    console.log('copied!!');
  };

  const createAccentsQuestion = async () => {
    const questionGroup = await createInitialQuestionGroup();

    if (!!questionGroup) {
      const docIds = await createAccentsQuestions({
        sentences,
        questionGroupId: questionGroup.id,
      });
      if (!!docIds.length) {
        const updatedQuestionGroup: QuestionGroup = {
          ...questionGroup,
          questions: docIds,
        };
        const result = await updateQuestionGroup(updatedQuestionGroup);
        if (!!result) {
          const createdQuestionSet = await createAccentsQuestionSet({
            title: article.title,
            questionGroupId: questionGroup.id,
            sentences,
          });
          if (!!createdQuestionSet) {
            setQuestionSetId(createdQuestionSet.id);
            navigate(`/accentsQuestion/${createdQuestionSet.id}`);
          }
        }
      }
    }
  };

  const createRhythmsQuestion = async () => {
    const questionGroup = await createInitialQuestionGroup();
    if (!!questionGroup) {
      const docIds = await createRhythmQuestions({
        sentences,
        downloadURL: article.downloadURL,
        questinGroupId: questionGroup.id,
      });
      if (!!docIds.length) {
        const updatedQuestionGroup: QuestionGroup = {
          ...questionGroup,
          questions: docIds,
        };
        const result = await updateQuestionGroup(updatedQuestionGroup);
        if (!!result) {
          const createdQuestionSet = await createRhythmQuestionSet({
            title: article.title,
            questionGroupId: questionGroup.id,
            accentsArray: sentences.map((sentence) => sentence.accents),
          });
          if (!!createdQuestionSet) {
            setQuestionSetId(createdQuestionSet.id);
            navigate(`/rhythmsQuestion/${createdQuestionSet.id}`);
          }
        }
      }
    }
  };

  const openPage = (path: string) => {
    navigate(path);
  };

  // ??????????????????

  if (!!article.id) {
    return (
      <ArticlePageComponent
        isSm={isSm}
        openPage={openPage}
        copySentenceParseNew={copySentenceParseNew}
        createAccentsQuestion={createAccentsQuestion}
        createRhythmsQuestion={createRhythmsQuestion}
        handleClickWidthButton={handleClickWidthButton}
      />
    );
  }
  // article ??? ?????????
  else {
    return <Navigate to={'/article/list'} />;
  }
};

export default ArticlePage;
