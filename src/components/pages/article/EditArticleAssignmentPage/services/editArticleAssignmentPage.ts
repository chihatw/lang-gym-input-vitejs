import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  buildAccents,
  buildAccentString,
} from '../../../../../entities/Accent';
import { AssignmentSentence } from '../../../../../entities/AssignmentSentence';
import { Sentence } from '../../../../../entities/Sentence';
import { getArticle } from '../../../../../repositories/article';
import { getAssignment } from '../../../../../repositories/assignment';
import {
  getAssignmentSentence,
  updateAssignmentSentence,
} from '../../../../../repositories/assignmentSentence';
import { getSentences } from '../../../../../repositories/sentence';

export const useEditArticleAssignmentPage = (
  id: string,
  uid: string,
  line: number
) => {
  const navigate = useNavigate();
  const [initializing, setInitializing] = useState(true);
  const [title, setTitle] = useState('');
  const [sentence, setSentence] = useState<Sentence | null>(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [accentString, setAccentString] = useState('');
  const [downloadURL, setDownloadURL] = useState('');
  const [originalAssignmentSentence, setOriginalAssignmentSentence] =
    useState<AssignmentSentence | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const article = await getArticle(id);
      !!article && setTitle(article.title);
      setInitializing(false);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const sentences = await getSentences(id);
      if (!!sentences) {
        setSentence(sentences.filter((s) => s.line === line)[0]);
      }
    };
    fetchData();
  }, [id, line]);

  useEffect(() => {
    const fetchData = async () => {
      const assignment = await getAssignment({ uid, articleID: id });
      !!assignment && setDownloadURL(assignment.downloadURL);
    };
    fetchData();
  });

  useEffect(() => {
    if (!uid) return;
    const fetchData = async () => {
      const assignmentSentence = await getAssignmentSentence({
        uid,
        articleID: id,
        line,
      });
      if (!!assignmentSentence) {
        setStart(assignmentSentence.start);
        setEnd(assignmentSentence.end);
        setAccentString(buildAccentString(assignmentSentence.accents));
        setOriginalAssignmentSentence(assignmentSentence);
      }
    };
    fetchData();
  }, [uid, line, id]);

  const onChangeStart = (start: number) => {
    setStart(start);
  };

  const onChangeEnd = (end: number) => {
    setEnd(end);
  };

  const onChangeAccentString = (accentString: string) => {
    setAccentString(accentString);
  };

  const onSubmit = async () => {
    const assignmentSentence: AssignmentSentence = {
      ...originalAssignmentSentence!,
      start,
      end,
      accents: buildAccents(accentString),
    };
    const { success } = await updateAssignmentSentence(assignmentSentence);
    if (success) {
      navigate(`/article/${id}/assignment?uid=${uid}`);
    }
  };

  return {
    initializing,
    title,
    sentence,
    start,
    onChangeStart,
    end,
    onChangeEnd,
    downloadURL,
    accentString,
    onChangeAccentString,
    onSubmit,
  };
};
