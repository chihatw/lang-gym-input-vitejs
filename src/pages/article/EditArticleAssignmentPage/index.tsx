import Speaker from '@bit/chihatw.lang-gym.speaker';
import { Button, TextField } from '@mui/material';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import accentsForPitchesArray from 'accents-for-pitches-array';
import { useMatch } from 'react-router-dom';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import TableLayout from '../../../components/templates/TableLayout';
import { AppContext } from '../../../services/app';
import { buildAccents, buildAccentString } from '../../../entities/Accent';
import {
  AssignmentSentence,
  useHandleAssignmentSentences,
} from '../../../services/useAssignmentSentences';

// TODO merge to Article Page
const EditArticleAssignmentPage = () => {
  const match = useMatch('/article/:id/assignment/uid/:uid/line/:line');
  const { article, isFetching, assignment, assignmentSentences } =
    useContext(AppContext);
  const line = Number(match?.params.line || 0);

  const assignmentSentence = useMemo(
    () => assignmentSentences[line],
    [assignmentSentences, line]
  );

  const { updateAssignmentSentence } = useHandleAssignmentSentences();

  const [end, setEnd] = useState(0);
  const [start, setStart] = useState(0);
  const [accentString, setAccentString] = useState('');

  useEffect(() => {
    if (!!assignmentSentence) {
      setStart(assignmentSentence.start);
      setEnd(assignmentSentence.end);
      setAccentString(buildAccentString(assignmentSentence.accents));
    }
  }, [assignmentSentence]);

  const onChangeEnd = (end: number) => {
    setEnd(end);
  };

  const onChangeStart = (start: number) => {
    setStart(start);
  };

  const onChangeAccentString = (accentString: string) => {
    setAccentString(accentString);
  };

  const onSubmit = async () => {
    const newAssignmentSentence: AssignmentSentence = {
      ...assignmentSentence,
      end,
      start,
      accents: buildAccents(accentString),
    };
    const { success } = await updateAssignmentSentence(newAssignmentSentence);
    if (success) {
      // callback()
    }
  };

  if (isFetching) {
    return <></>;
  } else {
    const downloadURL = assignment.downloadURL;
    return (
      <TableLayout
        title={`${article.title} - 提出アクセント`}
        backURL={`/article/${article.id}/assignment`}
      >
        <div
          style={{
            rowGap: 16,
            display: 'grid',
          }}
        >
          <TextField
            size='small'
            value={accentString}
            label='提出アクセント'
            variant='outlined'
            onChange={(e) => onChangeAccentString(e.target.value)}
            multiline
          />
          <SentencePitchLine
            pitchesArray={accentsForPitchesArray(buildAccents(accentString))}
          />
          <div
            style={{
              display: 'grid',
              columnGap: 16,
              gridTemplateColumns: '32px 80px 80px',
            }}
          >
            <Speaker start={start} end={end} downloadURL={downloadURL} />

            <TextField
              variant='outlined'
              size='small'
              label='start'
              value={start}
              type='number'
              onChange={(e) => onChangeStart(Number(e.target.value))}
            />
            <TextField
              variant='outlined'
              size='small'
              label='end'
              value={end}
              type='number'
              onChange={(e) => onChangeEnd(Number(e.target.value))}
            />
          </div>

          <Button fullWidth variant='contained' onClick={onSubmit}>
            更新
          </Button>
        </div>
      </TableLayout>
    );
  }
};

export default EditArticleAssignmentPage;
