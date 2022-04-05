import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AssignmentSentence } from '../../../../entities/AssignmentSentence';
import { Mark } from '../../../../entities/Mark';
import {
  deleteAssignment,
  getAssignment,
} from '../../../../repositories/assignment';
import {
  deleteAssignmentSentences,
  getAssignmentSentences,
  updateAssignmentSentences,
} from '../../../../repositories/assignmentSentence';
import { deleteFile } from '../../../../repositories/file';
import { getSentences } from '../../../../repositories/sentence';
import { Article } from '../../../../services/useArticles';

export const useEditArticleAssignmentVoicePage = ({
  id,
  uid,
  article,
}: {
  id: string;
  uid: string;
  article: Article;
}) => {
  const navigate = useNavigate();
  const [sentences, setSentences] = useState<string[]>([]);
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
    if (!article.id) return;
    const fetchData = async () => {
      // debug?
      const ondokuSentences = await getSentences(article.id);
      if (!!ondokuSentences) {
        setSentences(ondokuSentences.map((s) => s.japanese));
      }
    };
    fetchData();
  }, [article]);

  useEffect(() => {
    const fetchData = async () => {
      console.log({ id, uid });
      const assignment = await getAssignment({ articleID: id, uid });
      console.log({ assignment });
      setDownloadURL(!!assignment ? assignment.downloadURL : '');
      if (!!assignment) {
        setAssignmentID(assignment.id);
        const assignmentSentences = await getAssignmentSentences({
          uid,
          articleID: id,
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
  }, [uid, id]);

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
      navigate(`/article/${id}/assignment/?uid=${uid}`);
    }
  };

  return {
    sentences,
    uid,
    downloadURL,
    marks,
    onDeleteAudio,
    onChangeMarks,
    hasChange,
    onSubmit,
  };
};
