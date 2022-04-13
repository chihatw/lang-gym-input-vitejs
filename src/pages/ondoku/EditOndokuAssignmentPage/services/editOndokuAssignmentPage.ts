import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildAccents, buildAccentString } from '../../../../entities/Accent';

import { OndokuSentence } from '../../../../entities/OndokuSentence';
import { getAssignment } from '../../../../repositories/assignment';
import { getAssignmentSentence } from '../../../../repositories/assignmentSentence';
import { getOndokuSentences } from '../../../../repositories/ondokuSentence';
import { AppContext } from '../../../../services/app';
import {
  AssignmentSentence,
  useHandleAssignmentSentences,
} from '../../../../services/useAssignmentSentences';

export const useEditOndokuAssignmentPage = (
  id: string,
  uid: string,
  line: number
) => {
  const navigate = useNavigate();

  const { ondoku } = useContext(AppContext);

  const { updateAssignmentSentence } = useHandleAssignmentSentences();
  const [title, setTitle] = useState('');
  const [sentence, setSentence] = useState<OndokuSentence | null>(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [accentString, setAccentString] = useState('');
  const [downloadURL, setDownloadURL] = useState('');
  const [originalAssignmentSentence, setOriginalAssignmentSentence] =
    useState<AssignmentSentence | null>(null);

  useEffect(() => {
    setTitle(ondoku.title);
  }, [ondoku]);

  useEffect(() => {
    const fetchData = async () => {
      const sentences = await getOndokuSentences(id);
      if (!!sentences) {
        setSentence(sentences.filter((s) => s.line === line)[0]);
      }
    };
    fetchData();
  }, [id, line]);

  useEffect(() => {
    const fetchData = async () => {
      const assignment = await getAssignment({ uid, ondokuID: id });
      !!assignment && setDownloadURL(assignment.downloadURL);
    };
    fetchData();
  });

  useEffect(() => {
    if (!uid) return;
    const fetchData = async () => {
      const assignmentSentence = await getAssignmentSentence({
        uid,
        ondokuID: id,
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
    const result = await updateAssignmentSentence(assignmentSentence);
    if (!!result) {
      navigate(`/ondoku/${id}/assignment?uid=${uid}`);
    }
  };

  return {
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
