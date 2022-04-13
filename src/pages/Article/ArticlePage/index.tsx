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

  const { createAccentsQuestions, createRhythmQuestions } =
    useHandleQuestions();
  const { createInitialQuestionGroup, updateQuestionGroup } =
    useHandleQuestionGroups();
  const { createAccentsQuestionSet, createRhythmQuestionSet } =
    useHandleQuestionSets();

  const {
    article,
    sentences,
    isFetching,
    assignment,
    sentenceParseNews,
    assignmentSentences,
  } = useContext(AppContext);

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
    console.log(JSON.stringify(item));
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
        const { success } = await updateQuestionGroup(updatedQuestionGroup);
        if (success) {
          const questionSetID = await createAccentsQuestionSet({
            title: article.title,
            questionGroupId: questionGroup.id,
            sentences,
          });
          if (!!questionSetID) {
            navigate(`/accentsQuestion/${questionSetID}`);
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
        const { success } = await updateQuestionGroup(updatedQuestionGroup);
        if (success) {
          const questionSetId = await createRhythmQuestionSet({
            title: article.title,
            questionGroupId: questionGroup.id,
            accentsArray: sentences.map((sentence) => sentence.accents),
          });
          if (!!questionSetId) {
            navigate(`/rhythmsQuestion/${questionSetId}`);
          }
        }
      }
    }
  };

  const openPage = (path: string) => {
    navigate(path);
  };

  // データ取得中
  if (isFetching) {
    return <></>;
  } else {
    if (!!article.id) {
      return (
        <ArticlePageComponent
          isSm={isSm}
          article={article}
          sentences={sentences}
          assignment={assignment}
          sentenceParseNews={sentenceParseNews}
          assignmentSentences={assignmentSentences}
          openPage={openPage}
          copySentenceParseNew={copySentenceParseNew}
          createAccentsQuestion={createAccentsQuestion}
          createRhythmsQuestion={createRhythmsQuestion}
          handleClickWidthButton={handleClickWidthButton}
        />
      );
    }
    // article が 初期値
    else {
      return <Navigate to={'/article/list'} />;
    }
  }
};

export default ArticlePage;
