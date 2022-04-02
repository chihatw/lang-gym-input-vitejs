// https://firebase.google.com/docs/storage/web/download-files#download_data_via_url
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL } from '@firebase/storage';
import { Assignment, CreateAssignment } from '../../../../entities/Assignment';
import {
  AssignmentSentence,
  CreateAssignmentSentence,
} from '../../../../entities/AssignmentSentence';
import { Ondoku } from '../../../../entities/Ondoku';
import { OndokuSentence } from '../../../../entities/OndokuSentence';
import { User } from '../../../../entities/User';
import {
  createAssignment,
  deleteAssignment,
  getAssignment,
} from '../../../../repositories/assignment';
import {
  createAssignmentSentenes,
  deleteAssignmentSentences,
  getAssignmentSentences,
} from '../../../../repositories/assignmentSentence';
import { deleteFile, uploadFile } from '../../../../repositories/file';
import { getOndoku } from '../../../../repositories/ondoku';
import { getOndokuSentences } from '../../../../repositories/ondokuSentence';
import { getUsers } from '../../../../repositories/user';

export const useOndokuAssignmentPage = (id: string) => {
  const navigate = useNavigate();
  const [initializing, setInitializing] = useState(true);
  const [ondoku, setOndoku] = useState<Ondoku | null>(null);
  const [uid, setUid] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [sentences, setSentences] = useState<OndokuSentence[]>([]);
  const [assignmentSentences, setAssignmentSentences] = useState<
    AssignmentSentence[]
  >([]);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const ondoku = await getOndoku(id);
      setOndoku(ondoku);
      setInitializing(false);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const sentences = await getOndokuSentences(id);
      !!sentences && setSentences(sentences);
    };
    fetchData();
  }, [id]);

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
      const { success } = await deleteAssignment(assignment.id);
      if (success) {
        const { success } = await deleteAssignmentSentences(
          assignmentSentences.map((s) => s.id)
        );
        if (success) {
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
      const { success } = await createAssignment(assignment);
      if (success) {
        const assignmentSentences: CreateAssignmentSentence[] = sentences.map(
          (s) => ({
            article: '',
            uid: uid,
            ondoku: id,
            accents: s.accents,
            end: 0,
            start: 0,
            line: s.line,
            mistakes: [],
          })
        );
        const { success } = await createAssignmentSentenes(assignmentSentences);
        if (success) {
          navigate(`/ondoku/${id}/assignment/uid/${uid}/voice`);
        }
      }
    }
  };
  return {
    assignment,
    assignmentSentences,
    initializing,
    ondoku,
    uid,
    onChangeUid,
    users,
    sentences,
    onDelete,
    onUpload,
  };
};
