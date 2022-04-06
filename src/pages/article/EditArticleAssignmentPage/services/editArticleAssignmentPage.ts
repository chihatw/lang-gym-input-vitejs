import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

import { Sentence } from '../../../../entities/Sentence';
import { AppContext } from '../../../../services/app';
import { AssignmentSentence } from '../../../../services/useAssignmentSentences';
import { buildAccents, buildAccentString } from '../../../../entities/Accent';
import {
  getAssignmentSentence,
  updateAssignmentSentence,
} from '../../../../repositories/assignmentSentence';

export const useEditArticleAssignmentPage = (
  id: string,
  uid: string,
  line: number
) => {
  const navigate = useNavigate();

  const { sentences, assignment } = useContext(AppContext);

  const [end, setEnd] = useState(0);
  const [start, setStart] = useState(0);
  const [sentence, setSentence] = useState<Sentence | null>(null);
  const [downloadURL, setDownloadURL] = useState('');
  const [accentString, setAccentString] = useState('');
  const [originalAssignmentSentence, setOriginalAssignmentSentence] =
    useState<AssignmentSentence | null>(null);

  useEffect(() => {
    setSentence(sentences.filter((s) => s.line === line)[0]);
  }, [sentences, id, line]);

  useEffect(() => {
    setDownloadURL(assignment.downloadURL);
  }, [assignment]);

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
