// https://firebase.google.com/docs/storage/web/download-files#download_data_via_url
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL } from '@firebase/storage';
import { CreateAssignment } from '../../../../entities/Assignment';
import { CreateAssignmentSentence } from '../../../../entities/AssignmentSentence';

import { getAssignment } from '../../../../repositories/assignment';
import { getAssignmentSentences } from '../../../../repositories/assignmentSentence';
import { deleteFile, uploadFile } from '../../../../repositories/file';
import { getUsers } from '../../../../repositories/user';
import { User } from '../../../../services/useUsers';
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
  const { ondoku, ondokuSentences } = useContext(AppContext);

  const { createAssignment, deleteAssignment } = useHandleAssignments();
  const { createAssignmentSentences, deleteAssignmentSentences } =
    useHandleAssignmentSentences();

  const [uid, setUid] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [assignmentSentences, setAssignmentSentences] = useState<
    AssignmentSentence[]
  >([]);
  const [assignment, setAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const users = await getUsers(10);
      setUsers(users || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!uid) return;
    const fetchData = async () => {
      const assignment = await getAssignment({ uid, ondokuID: id });
      setAssignment(assignment);
      const assignmentSentences = await getAssignmentSentences({
        uid,
        ondokuID: id,
      });
      setAssignmentSentences(assignmentSentences || []);
    };
    fetchData();
  }, [uid, id]);

  const onChangeUid = useCallback((uid: string) => {
    setUid(uid);
  }, []);

  const onDelete = useCallback(async () => {
    if (!assignment) return;
    const path = decodeURIComponent(
      assignment.downloadURL.split('/')[7].split('?')[0]
    );
    const { success } = await deleteFile(path);
    if (success) {
      const result = await deleteAssignment(assignment.id);
      if (result) {
        const result = await deleteAssignmentSentences(
          assignmentSentences.map((s) => s.id)
        );
        if (!!result) {
          navigate('/ondoku/list');
        }
      }
    }
  }, [navigate, assignmentSentences, assignment]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const { success, snapshot } = await uploadFile(file, 'ondokus');
    if (!!success && !!snapshot) {
      const url = await getDownloadURL(snapshot.ref);
      const assignment: CreateAssignment = {
        article: '',
        ondoku: id,
        uid,
        downloadURL: url,
      };
      const result = await createAssignment(assignment);
      if (!!result) {
        const assignmentSentences: CreateAssignmentSentence[] =
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
    assignment,
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
