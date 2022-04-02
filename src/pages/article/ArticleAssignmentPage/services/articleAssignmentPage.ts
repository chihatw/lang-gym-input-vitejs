import { getDownloadURL } from '@firebase/storage';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateAssignment } from '../../../../entities/Assignment';
import {
  AssignmentSentence,
  CreateAssignmentSentence,
} from '../../../../entities/AssignmentSentence';
import { Sentence } from '../../../../entities/Sentence';
import { getArticle } from '../../../../repositories/article';
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
import { getSentences } from '../../../../repositories/sentence';

export const useArticleAssignmentPage = (id: string) => {
  const navigate = useNavigate();
  const [initializing, setInitializing] = useState(true);
  const [title, setTitle] = useState('');
  const [uid, setUid] = useState('');
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [downloadURL, setDownloadURL] = useState('');
  const [assignmentID, setAssignmentID] = useState('');
  const [assignmentSentences, setAssignmentSentences] = useState<
    AssignmentSentence[]
  >([]);
  useEffect(() => {
    const fetchData = async () => {
      const article = await getArticle(id);
      if (!!article) {
        setTitle(article.title);
        setUid(article.uid);
      }
      setInitializing(false);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const sentences = await getSentences(id);
      !!sentences && setSentences(sentences);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!uid) return;
    const fetchData = async () => {
      const assignment = await getAssignment({ uid, articleID: id });
      if (!!assignment) {
        setDownloadURL(assignment.downloadURL);
        setAssignmentID(assignment.id);
      }
      const assignmentSentences = await getAssignmentSentences({
        uid,
        articleID: id,
      });
      if (!!assignmentSentences) {
        setAssignmentSentences(assignmentSentences);
      }
    };
    fetchData();
  }, [uid, id]);

  const onDelete = useCallback(async () => {
    const path = decodeURIComponent(downloadURL.split('/')[7].split('?')[0]);
    const { success } = await deleteFile(path);
    if (success) {
      const { success } = await deleteAssignment(assignmentID);
      if (success) {
        const { success } = await deleteAssignmentSentences(
          assignmentSentences.map((s) => s.id)
        );
        if (success) {
          navigate('/article/list');
        }
      }
    }
  }, [downloadURL, navigate, assignmentSentences, assignmentID]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const { success, snapshot } = await uploadFile(file, 'articles');
    if (!!success && !!snapshot) {
      const url = await getDownloadURL(snapshot.ref);
      const assignment: CreateAssignment = {
        ondoku: '',
        article: id,
        uid,
        downloadURL: url,
      };
      const { success } = await createAssignment(assignment);
      if (success) {
        const assignmentSentences: CreateAssignmentSentence[] = sentences.map(
          (s) => ({
            ondoku: '',
            uid: uid,
            article: id,
            accents: s.accents,
            end: 0,
            start: 0,
            line: s.line,
            mistakes: [],
          })
        );
        const { success } = await createAssignmentSentenes(assignmentSentences);
        if (success) {
          navigate(`/article/${id}/assignment/uid/${uid}/voice`);
        }
      }
    }
  };
  return {
    initializing,
    title,
    assignmentSentences,
    sentences,
    downloadURL,
    onDelete,
    onUpload,
  };
};
