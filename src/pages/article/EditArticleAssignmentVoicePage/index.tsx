import React, { useContext, useEffect, useState } from 'react';

import ArticleAssignmentVoice from './components/ArticleAssignmentVoice';
import TableLayout from '../../../components/templates/TableLayout';
import { AppContext } from '../../../services/app';
import { useNavigate } from 'react-router-dom';
import { Mark } from '../../../entities/Mark';
import { AssignmentSentence } from '../../../entities/AssignmentSentence';
import {
  deleteAssignment,
  getAssignment,
} from '../../../repositories/assignment';
import {
  deleteAssignmentSentences,
  getAssignmentSentences,
  updateAssignmentSentences,
} from '../../../repositories/assignmentSentence';
import { deleteFile } from '../../../repositories/file';

// ArticleAssignmentPage で upload した後、ここに飛ばされる
// TODO merge to Article Edit Page

const EditArticleAssignmentVoicePage = () => {
  const { article, isFetching, sentences } = useContext(AppContext);

  const navigate = useNavigate();

  const [downloadURL, setDownloadURL] = useState('');
  const [assignmentID, setAssignmentID] = useState('');
  const [marks, setMarks] = useState<Mark[]>(
    sentences.map((s) => ({ start: 0, end: 0 }))
  );
  const [originalMarks, setOriginalMarks] = useState<Mark[]>([]);
  const [originalSentences, setOriginalSentences] = useState<
    AssignmentSentence[]
  >([]);
  const [hasChange, setHasChange] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const assignment = await getAssignment({
        articleID: article.id,
        uid: article.uid,
      });
      console.log({ assignment });
      setDownloadURL(!!assignment ? assignment.downloadURL : '');
      if (!!assignment) {
        setAssignmentID(assignment.id);
        const assignmentSentences = await getAssignmentSentences({
          uid: article.uid,
          articleID: article.id,
        });
        if (!!assignmentSentences) {
          setMarks(
            assignmentSentences.map((s) => ({ start: s.start, end: s.end }))
          );
          setOriginalMarks(
            assignmentSentences.map((s) => ({ start: s.start, end: s.end }))
          );
          setOriginalSentences(assignmentSentences);
        }
      }
    };
    fetchData();
  }, [article]);

  useEffect(() => {
    setHasChange(JSON.stringify(marks) !== JSON.stringify(originalMarks));
  }, [marks, originalMarks]);

  const onDeleteAudio = async () => {
    if (window.confirm('audioファイルを削除しますか')) {
      const path = decodeURIComponent(downloadURL.split('/')[7].split('?')[0]);
      const { success } = await deleteFile(path);
      if (success) {
        const { success } = await deleteAssignment(assignmentID);
        if (success) {
          const { success } = await deleteAssignmentSentences(
            originalSentences.map((s) => s.id)
          );
          if (success) {
            navigate('/article/list');
          }
        }
      }
    }
  };

  const onChangeMarks = (marks: Mark[]) => {
    setMarks(marks);
  };

  const onSubmit = async () => {
    const sentences: AssignmentSentence[] = originalSentences.map(
      (s, index) => ({
        ...s,
        start: marks[index].start,
        end: marks[index].end,
      })
    );
    const { success } = await updateAssignmentSentences(sentences);
    if (success) {
      navigate(`/article/${article.id}/assignment/?uid=${article.uid}`);
    }
  };
  if (isFetching) {
    return <></>;
  } else {
    return (
      <TableLayout
        title={`${article.title} - 提出音声`}
        backURL='/article/list'
      >
        <ArticleAssignmentVoice
          marks={marks}
          sentences={sentences.map((sentence) =>
            sentence.japanese.slice(0, 20)
          )}
          hasChange={hasChange}
          downloadURL={downloadURL}
          onSubmit={onSubmit}
          onDeleteAudio={onDeleteAudio}
          onChangeMarks={onChangeMarks}
        />
      </TableLayout>
    );
  }
};

export default EditArticleAssignmentVoicePage;
