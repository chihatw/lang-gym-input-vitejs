import { getDownloadURL } from '@firebase/storage';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateAssignment } from '../../../../entities/Assignment';
import {
  AssignmentSentence,
  CreateAssignmentSentence,
} from '../../../../entities/AssignmentSentence';
import { Sentence } from '../../../../entities/Sentence';
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
import { AppContext } from '../../../../services/app';

export const useArticleAssignmentPage = () => {
  const navigate = useNavigate();
  const { article } = useContext(AppContext);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [downloadURL, setDownloadURL] = useState('');
  const [assignmentID, setAssignmentID] = useState('');
  const [assignmentSentences, setAssignmentSentences] = useState<
    AssignmentSentence[]
  >([]);

  useEffect(() => {
    if (!article.id) return;
    const fetchData = async () => {
      const sentences = await getSentences(article.id);
      !!sentences && setSentences(sentences);
    };
    fetchData();
  }, [article.id]);

  useEffect(() => {
    if (!article.id) return;
    const fetchData = async () => {
      const assignment = await getAssignment({
        uid: article.uid,
        articleID: article.id,
      });
      if (!!assignment) {
        setDownloadURL(assignment.downloadURL);
        setAssignmentID(assignment.id);
      }
      const assignmentSentences = await getAssignmentSentences({
        uid: article.uid,
        articleID: article.id,
      });
      if (!!assignmentSentences) {
        setAssignmentSentences(assignmentSentences);
      }
    };
    fetchData();
  }, [article]);

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
        article: article.id,
        uid: article.id,
        downloadURL: url,
      };
      const { success } = await createAssignment(assignment);
      if (success) {
        const assignmentSentences: CreateAssignmentSentence[] = sentences.map(
          (s) => ({
            ondoku: '',
            uid: article.uid,
            article: article.id,
            accents: s.accents,
            end: 0,
            start: 0,
            line: s.line,
            mistakes: [],
          })
        );
        const { success } = await createAssignmentSentenes(assignmentSentences);
        if (success) {
          // TODO これ url パラメータで渡す必要ある？
          navigate(
            `/article/${article.id}/assignment/uid/${article.uid}/voice`
          );
        }
      }
    }
  };
  return {
    sentences,
    downloadURL,
    assignmentSentences,
    onDelete,
    onUpload,
  };
};
