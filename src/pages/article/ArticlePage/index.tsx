import { Navigate, useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import TableLayout from '../../../components/templates/TableLayout';
import { Sentence } from '../../../entities/Sentence';
import { AppContext } from '../../../services/app';
import { getSentences } from '../../../repositories/sentence';
import ArticleSentenceList from './components/ArticleSentenceList';
import { useHandleQuestions } from '../../../services/useQuestions';
import { useHandleQuestionSets } from '../../../services/useQuestionSets';
import {
  QuestionGroup,
  useHandleQuestionGroups,
} from '../../../services/useQuestionGroups';

const ArticlePage = () => {
  const navigate = useNavigate();

  const { createAccentsQuestions, createRhythmQuestions } =
    useHandleQuestions();
  const { createInitialQuestionGroup, updateQuestionGroup } =
    useHandleQuestionGroups();
  const { createAccentsQuestionSet, createRhythmQuestionSet } =
    useHandleQuestionSets();

  const { article, isFetching } = useContext(AppContext);
  const [sentences, setSentences] = useState<Sentence[]>([]);

  useEffect(() => {
    if (!article.id) return;
    const fetchData = async () => {
      const sentences = await getSentences(article.id);
      !!sentences && setSentences(sentences);
    };
    fetchData();
  }, [article]);

  const onCreateAccentsQuestion = async () => {
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

  const onCreateRhythmsQuestion = async () => {
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

  const openPage = ({
    path,
    sentence,
  }: {
    path: string;
    sentence: Sentence;
  }) => {
    // TODO sentenceId の設定？
    navigate(`/sentence/${path}`);
  };

  // データ取得中
  if (isFetching) {
    return <></>;
  } else {
    if (!!article.id) {
      return (
        <TableLayout title={article.title} backURL={`/article/list`}>
          <ArticleSentenceList
            article={article}
            sentences={sentences}
            openPage={openPage}
            onCreateAccentsQuestion={onCreateAccentsQuestion}
            onCreateRhythmsQuestion={onCreateRhythmsQuestion}
          />
        </TableLayout>
      );
    }
    // article が 初期値
    else {
      return <Navigate to={'/article/list'} />;
    }
  }
};

export default ArticlePage;
