import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

import { Mark } from '../../../../entities/Mark';
import { deleteFile } from '../../../../repositories/file';
import {
  AssignmentSentence,
  useHandleAssignmentSentences,
} from '../../../../services/useAssignmentSentences';
import { getAssignmentSentences } from '../../../../repositories/assignmentSentence';
import { useHandleAssignments } from '../../../../services/useAssignments';
import { AppContext } from '../../../../services/app';

export const useEditOndokuAssignmentVoicePage = (id: string, uid: string) => {
  const navigate = useNavigate();
  const { ondoku, ondokuSentences, ondokuAssignment } = useContext(AppContext);
  const { deleteAssignment } = useHandleAssignments();
  const { updateAssignmentSentences, deleteAssignmentSentences } =
    useHandleAssignmentSentences();
  const [title, setTitle] = useState('');

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
    if (!ondoku.id) return;

    setTitle(ondoku.title);
    setSentences(ondokuSentences.map((s) => s.japanese));
  }, [ondoku, ondokuSentences]);

  useEffect(() => {
    if (!ondokuAssignment.id) return;
    const fetchData = async () => {
      setDownloadURL(ondokuAssignment.downloadURL);

      setAssignmentID(ondokuAssignment.id);
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
    };
    fetchData();
  }, [uid, id, ondokuAssignment]);

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
          const result = await deleteAssignmentSentences(
            originalSentences.map((s) => s.id)
          );
          if (result!!) {
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
    const result = await updateAssignmentSentences(sentences);
    if (!!result) {
      navigate(`/ondoku/${id}/assignment/?uid=${uid}`);
    }
  };

  return {
    title,
    initializing: false,
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
