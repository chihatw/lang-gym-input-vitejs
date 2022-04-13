import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { Mark } from '../../../../entities/Mark';
import { getOndoku } from '../../../../repositories/ondoku';
import { deleteFile } from '../../../../repositories/file';
import { getOndokuSentences } from '../../../../repositories/ondokuSentence';
import {
  AssignmentSentence,
  useHandleAssignmentSentences,
} from '../../../../services/useAssignmentSentences';
import { getAssignment } from '../../../../repositories/assignment';
import { getAssignmentSentences } from '../../../../repositories/assignmentSentence';
import { useHandleAssignments } from '../../../../services/useAssignments';

export const useEditOndokuAssignmentVoicePage = (id: string, uid: string) => {
  const navigate = useNavigate();
  const { deleteAssignment } = useHandleAssignments();
  const { updateAssignmentSentences, deleteAssignmentSentences } =
    useHandleAssignmentSentences();
  const [title, setTitle] = useState('');
  const [initializing, setInitializing] = useState(true);
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
    const fetchData = async () => {
      const ondoku = await getOndoku(id);
      if (!!ondoku) {
        setTitle(ondoku.title);
        const ondokuSentences = await getOndokuSentences(ondoku.id);
        if (!!ondokuSentences) {
          setSentences(ondokuSentences.map((s) => s.japanese));
        }
      }
      setInitializing(false);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const assignment = await getAssignment({ ondokuID: id, uid });
      setDownloadURL(!!assignment ? assignment.downloadURL : '');
      if (!!assignment) {
        setAssignmentID(assignment.id);
        const assignmentSentences = await getAssignmentSentences({
          uid,
          ondokuID: id,
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
        const result = await deleteAssignment(assignmentID);
        if (result) {
          const { success } = await deleteAssignmentSentences(
            originalSentences.map((s) => s.id)
          );
          if (success) {
            navigate('/ondoku/list');
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
      navigate(`/ondoku/${id}/assignment/?uid=${uid}`);
    }
  };

  return {
    title,
    initializing,
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
