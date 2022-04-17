import { Button, Container } from '@mui/material';
import { getDownloadURL } from 'firebase/storage';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mark } from '../../../../entities/Mark';
import { deleteFile, uploadFile } from '../../../../repositories/file';
import { buildMarks } from '../../../../services/buildMarks';
import { buildPeaks } from '../../../../services/buildPeaks';
import { Article } from '../../../../services/useArticles';
import {
  Assignment,
  useHandleAssignments,
} from '../../../../services/useAssignments';
import {
  AssignmentSentence,
  INITIAL_ASSINGMENT_SENTENCE,
  useHandleAssignmentSentences,
} from '../../../../services/useAssignmentSentences';
import { Sentence } from '../../../../services/useSentences';
import EditAudioPane from './EditAudioPane';

const CANVAS_WIDTH = 550;
const INITIAL_BLANK_DURATION = 700;

const EditAssignmentVoicePane = ({
  article,
  sentences,
  assignment,
  assignmentSentences,
}: {
  article: Article;
  sentences: Sentence[];
  assignment: Assignment;
  assignmentSentences: AssignmentSentence[];
}) => {
  const navigate = useNavigate();

  const audioContext = useMemo(() => new AudioContext(), []);

  const { createAssignment, deleteAssignment } = useHandleAssignments();
  const {
    createAssignmentSentences,
    updateAssignmentSentences,
    deleteAssignmentSentences,
  } = useHandleAssignmentSentences();

  const [scale, setScale] = useState(5);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [channelData, setChannelData] = useState<Float32Array | null>(null);

  /**
   * assignmentSentences から marks 抽出
   */
  useEffect(() => {
    if (
      !article ||
      !assignmentSentences.length ||
      assignmentSentences[0].article !== article.id
    )
      return;
    const marks = assignmentSentences.map(({ end, start }) => ({
      end,
      start,
    }));
    setMarks(marks);
  }, [assignmentSentences, article]);

  /**
   * assignment.downloadURL から channelData を取得
   */
  useEffect(() => {
    if (
      !assignment.downloadURL ||
      !assignmentSentences.length ||
      assignmentSentences[0].article !== article.id ||
      !!channelData
    )
      return;

    const request = new XMLHttpRequest();

    request.open('GET', assignment.downloadURL, true);
    request.responseType = 'arraybuffer';
    request.onload = () => {
      audioContext.decodeAudioData(request.response, (buffer) => {
        const channelData = buffer.getChannelData(0);
        const marks = assignmentSentences.map(({ start, end }) => ({
          start,
          end,
        }));
        handleSetChannelData({
          marks,
          channelData,
        });
      });
    };
    request.send();
  }, [article, assignment, assignmentSentences]);

  /**
   * channelData をセットする時に、 scale, peaks もセットする
   * marks は既存のものがあれば、それを再利用、なければ blankDuration から作成
   */
  const handleSetChannelData = useCallback(
    ({
      marks: _marks,
      channelData: _channelData,
    }: {
      marks: Mark[];
      channelData: Float32Array | null;
    }) => {
      let _peaks: number[] = [];
      if (!!_channelData) {
        const _scale =
          (CANVAS_WIDTH * audioContext.sampleRate) / _channelData.length;
        setScale(_scale);
        _peaks = buildPeaks({
          scale: _scale,
          sampleRate: audioContext.sampleRate,
          channelData: _channelData,
        });
        const hasMarks = !!_marks.slice(-1)[0]?.end; // marks の最後の end が初期値の場合 marks を再設定する
        if (!hasMarks) {
          _marks = buildMarks({
            sampleRate: audioContext.sampleRate,
            channelData: _channelData,
            blankDuration: INITIAL_BLANK_DURATION,
          });
        }
        setMarks(_marks);
      } else {
        setMarks([]);
      }
      setPeaks(_peaks);
      setChannelData(_channelData);
    },
    [audioContext]
  );

  const handleChangeBlankDuration = (blankDuration: number) => {
    if (!channelData) return;
    const marks = buildMarks({
      channelData,
      blankDuration,
      sampleRate: audioContext.sampleRate,
    });
    setMarks(marks);
  };

  const handleChangeEnd = ({ index, end }: { index: number; end: number }) => {
    const clonedMarks = [...marks];
    clonedMarks[index] = { ...clonedMarks[index], end };
    setMarks(clonedMarks);
  };

  const handleChangeStart = ({
    index,
    start,
  }: {
    index: number;
    start: number;
  }) => {
    const clonedMarks = [...marks];
    clonedMarks[index] = { ...clonedMarks[index], start };
    setMarks(clonedMarks);
  };

  // upload 時、 assignment 作成
  const handleUploadAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const { success, snapshot } = await uploadFile(file, 'articles');
    if (!!success && !!snapshot) {
      const url = await getDownloadURL(snapshot.ref);
      const assignment: Omit<Assignment, 'id'> = {
        uid: article.uid,
        ondoku: '',
        article: article.id,
        downloadURL: url,
      };
      const result = await createAssignment(assignment);
      if (!!result) {
        const assignmentSentences: Omit<AssignmentSentence, 'id'>[] = [];

        sentences.forEach((sentence) => {
          const assignmentSentence: AssignmentSentence = {
            ...INITIAL_ASSINGMENT_SENTENCE,
            uid: article.uid,
            line: sentence.line,
            article: article.id,
            accents: sentence.accents,
          };
          const { id, ...omitted } = assignmentSentence;
          assignmentSentences.push(omitted);
        });
        createAssignmentSentences(assignmentSentences);
      }
    }
  };

  // delete 時、 assignment も削除
  const handleDeleteAudio = async () => {
    if (window.confirm('提出audioファイルを削除しますか')) {
      const path = decodeURIComponent(
        assignment.downloadURL.split('/')[7].split('?')[0]
      );
      deleteFile(path);
      deleteAssignment(assignment.id);
      deleteAssignmentSentences(assignmentSentences.map((s) => s.id));
    }
  };

  const updateMarks = async () => {
    const newAssignmentSentences: AssignmentSentence[] =
      assignmentSentences.map((assignmentSentence, index) => ({
        ...assignmentSentence,
        start: marks[index].start,
        end: marks[index].end,
      }));
    const result = await updateAssignmentSentences(newAssignmentSentences);
    if (!!result) {
      navigate(`/article/list`);
    }
  };
  return (
    <Container maxWidth='sm'>
      <div style={{ display: 'grid', rowGap: 16 }}>
        {assignment.downloadURL ? (
          <EditAudioPane
            isAssignment
            marks={marks}
            peaks={peaks}
            scale={scale}
            labels={sentences.map((sentence) => sentence.japanese.slice(0, 20))}
            hasMarks={!!assignmentSentences.slice(-1)[0]?.end}
            downloadURL={assignment.downloadURL}
            blankDuration={INITIAL_BLANK_DURATION}
            updateMarks={updateMarks}
            handleChangeEnd={handleChangeEnd}
            handleChangeStart={handleChangeStart}
            handleDeleteAudio={handleDeleteAudio}
            handleChangeBlankDuration={handleChangeBlankDuration}
          />
        ) : (
          <Button variant='contained' color='secondary' component='label'>
            提出 Audio アップロード
            <input
              aria-label='audio mp3 upload'
              type='file'
              style={{ display: 'none' }}
              onChange={handleUploadAudio}
            />
          </Button>
        )}
      </div>
    </Container>
  );
};

export default EditAssignmentVoicePane;
