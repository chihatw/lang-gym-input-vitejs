import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import { Mark } from '../../../entities/Mark';
import TableLayout from '../../../components/templates/TableLayout';
import { AppContext } from '../../../services/app';
import { deleteFile } from '../../../repositories/file';

import {
  AssignmentSentence,
  useHandleAssignmentSentences,
} from '../../../services/useAssignmentSentences';
import ArticleAssignmentVoice from './components/ArticleAssignmentVoice';
import { useHandleAssignments } from '../../../services/useAssignments';

// ArticleAssignmentPage で upload した後、ここに飛ばされる
// TODO merge to Article Edit Page

const EditArticleAssignmentVoicePage = () => {
  const { article, isFetching, sentences, assignment, assignmentSentences } =
    useContext(AppContext);

  const navigate = useNavigate();
  const { deleteAssignment } = useHandleAssignments();
  const { updateAssignmentSentences, deleteAssignmentSentences } =
    useHandleAssignmentSentences();

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
    setDownloadURL(assignment.downloadURL);
    setAssignmentID(assignment.id);
    setMarks(assignmentSentences.map((s) => ({ start: s.start, end: s.end })));
    setOriginalMarks(
      assignmentSentences.map((s) => ({ start: s.start, end: s.end }))
    );
    setOriginalSentences(assignmentSentences);
  }, [article, assignment, assignmentSentences]);

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
