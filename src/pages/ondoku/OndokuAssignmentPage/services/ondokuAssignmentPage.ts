// https://firebase.google.com/docs/storage/web/download-files#download_data_via_url
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL } from '@firebase/storage';

import { deleteFile, uploadFile } from '../../../../repositories/file';
import {
  Assignment,
  useHandleAssignments,
} from '../../../../services/useAssignments';
import {
  AssignmentSentence,
  useHandleAssignmentSentences,
} from '../../../../services/useAssignmentSentences';
import { AppContext } from '../../../../services/app';

export const useOndokuAssignmentPage = (id: string) => {
  const navigate = useNavigate();
  const {
    ondoku,
    ondokuSentences,
    ondokuAssignment,
    users,
    ondokuAssignmentSentences,
  } = useContext(AppContext);

  const { createAssignment, deleteAssignment } = useHandleAssignments();
  const { createAssignmentSentences, deleteAssignmentSentences } =
    useHandleAssignmentSentences();

  const [uid, setUid] = useState('');
  const [assignmentSentences, setAssignmentSentences] = useState<
    AssignmentSentence[]
  >([]);

  useEffect(() => {
    if (!uid || !ondokuAssignment.id) return;
    const assignmentSentences = ondokuAssignmentSentences;
    setAssignmentSentences(assignmentSentences || []);
  }, [uid, id, ondokuAssignment, ondokuAssignmentSentences]);

  const onChangeUid = useCallback((uid: string) => {
    setUid(uid);
  }, []);

  const onDelete = useCallback(async () => {
    if (!ondokuAssignment.id) return;
    const path = decodeURIComponent(
      ondokuAssignment.downloadURL.split('/')[7].split('?')[0]
    );
    const { success } = await deleteFile(path);
    if (success) {
      const result = await deleteAssignment(ondokuAssignment.id);
      if (result) {
        const result = await deleteAssignmentSentences(
          assignmentSentences.map((s) => s.id)
        );
        if (!!result) {
          navigate('/ondoku/list');
        }
      }
    }
  }, [navigate, assignmentSentences, ondokuAssignment]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const { success, snapshot } = await uploadFile(file, 'ondokus');
    if (!!success && !!snapshot) {
      const url = await getDownloadURL(snapshot.ref);
      const assignment: Omit<Assignment, 'id'> = {
        article: '',
        ondoku: id,
        uid,
        downloadURL: url,
      };
      const result = await createAssignment(assignment);
      if (!!result) {
        const assignmentSentences: Omit<AssignmentSentence, 'id'>[] =
          ondokuSentences.map((s) => ({
            article: '',
            uid: uid,
            ondoku: id,
            accents: s.accents,
            end: 0,
            start: 0,
            line: s.line,
            mistakes: [],
          }));
        const result = await createAssignmentSentences(assignmentSentences);
        if (!!result) {
          navigate(`/ondoku/${id}/assignment/uid/${uid}/voice`);
        }
      }
    }
  };
  return {
    assignment: ondokuAssignment,
    assignmentSentences,
    initializing: false,
    ondoku,
    uid,
    onChangeUid,
    users,
    sentences: ondokuSentences,
    onDelete,
    onUpload,
  };
};
