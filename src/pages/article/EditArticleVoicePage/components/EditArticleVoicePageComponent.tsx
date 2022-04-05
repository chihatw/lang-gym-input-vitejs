import { Pause, PlayArrow } from '@mui/icons-material';
import {
  Button,
  Grid,
  IconButton,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useCallback, useEffect, useState } from 'react';
import TableLayout from '../../../../components/templates/TableLayout';
import { Mark } from '../../../../entities/Mark';
import { Article } from '../../../../services/useArticles';
import MarksSlider from './MarksSlider';
import PlayButtonPane from './PlayButtonPane';
import WaveCanvas from './WaveCanvas';

const WAVE_COLOR = 'pink';
const HEIGHT = 100;

const EditArticleVoicePageComponent = ({
  isPlaying,
  peaks,
  marks,
  article,
  sentences,
  duration,
  blankDuration,
  sentenceLines,
  currentTime,
  onUpload,
  onSubmit,
  onChangeMarks,
  onDeleteAudio,
  handleChangeBlankDuration,
  handlePlay,
}: {
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  peaks: number[];
  marks: Mark[];
  article: Article;
  sentences: string[];
  blankDuration: number;
  sentenceLines: { xPos: number; color: string }[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onSubmit: () => Promise<void>;
  onChangeMarks: (marks: Mark[]) => void;
  onDeleteAudio: () => Promise<void>;
  handleChangeBlankDuration: (value: number) => void;
  handlePlay: () => void;
}) => {
  return (
    <TableLayout title={`${article.title} - 録音`} backURL='/article/list'>
      {article.downloadURL ? (
        <>
          {!!sentences.length && (
            <AudioEdit
              peaks={peaks}
              marks={marks}
              duration={duration}
              isPlaying={isPlaying}
              sentences={sentences}
              currentTime={currentTime}
              downloadURL={article.downloadURL}
              sentenceLines={sentenceLines}
              blankDuration={blankDuration}
              onSubmit={onSubmit}
              handlePlay={handlePlay}
              onDeleteAudio={onDeleteAudio}
              onChangeMarks={onChangeMarks}
              handleChangeBlankDuration={handleChangeBlankDuration}
            />
          )}
        </>
      ) : (
        <Button variant='contained' component='label'>
          アップロード
          <input
            aria-label='audio mp3 upload'
            type='file'
            style={{ display: 'none' }}
            onChange={onUpload}
          />
        </Button>
      )}
    </TableLayout>
  );
};

export default EditArticleVoicePageComponent;

const AudioEdit: React.FC<{
  marks: Mark[];
  peaks: number[];
  duration: number;
  sentences: string[];
  isPlaying: boolean;
  downloadURL: string;
  currentTime: number;
  sentenceLines: { xPos: number; color: string }[];
  blankDuration: number;
  onSubmit: () => void;
  handlePlay: () => void;
  onDeleteAudio: () => void;
  onChangeMarks: (marks: Mark[]) => void;
  handleChangeBlankDuration: (value: number) => void;
}> = ({
  marks,
  peaks,
  duration,
  sentences,
  isPlaying,
  downloadURL,
  currentTime,
  sentenceLines,
  blankDuration,
  onSubmit,
  handlePlay,
  onChangeMarks,
  onDeleteAudio,
  handleChangeBlankDuration,
}) => {
  const { onChangeAudioEditCurrentTime, scale, onChangeScale } = useAudioEdit();

  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <ScaleSlider scale={scale} onChangeScale={onChangeScale} />

      <PlayButtonPane
        duration={duration}
        isPlaying={isPlaying}
        handlePlay={handlePlay}
        currentTime={currentTime}
      />
      <div
        style={{
          border: '1px solid #eee',
          maxWidth: 600,
          overflow: 'scroll',
          position: 'relative',
        }}
      >
        {!!peaks.length && (
          <WaveCanvas
            peaks={peaks}
            height={HEIGHT}
            color={WAVE_COLOR}
            sentenceLines={sentenceLines}
            currentTimePos={currentTime * scale}
          />
        )}
      </div>
      <MarksSlider
        superValue={blankDuration}
        superHandleChangeValue={handleChangeBlankDuration}
      />

      <Button variant='contained' onClick={onDeleteAudio}>
        delete audio file
      </Button>

      {sentences.length === marks.length && (
        <MarkTable
          sentences={sentences}
          marks={marks}
          downloadURL={downloadURL}
          onChangeMarks={onChangeMarks}
          onChangeAudioEditCurrentTime={onChangeAudioEditCurrentTime}
        />
      )}

      <Button variant='contained' onClick={onSubmit}>
        送信
      </Button>
    </div>
  );
};

const MarkTable: React.FC<{
  marks: Mark[];
  sentences: string[];
  downloadURL: string;
  onChangeMarks: (marks: Mark[]) => void;
  onChangeAudioEditCurrentTime: (currentTime: number) => void;
}> = ({
  marks,
  sentences,
  downloadURL,
  onChangeMarks,
  onChangeAudioEditCurrentTime,
}) => {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [isPlayings, setIsPlayings] = useState(marks.map((m) => false));

  const [values, setValues] = useState<Mark[]>(
    sentences.map((s) => ({ start: 0, end: 0 }))
  );

  useEffect(() => {
    return () => {
      !!audioElement && audioElement.pause();
    };
  }, [audioElement]);

  useEffect(() => {
    setValues(
      sentences.map((s, index) => {
        const mark = marks[index];
        return !!mark ? mark : { start: 0, end: 0 };
      })
    );
  }, [sentences, marks]);

  const onChangeValue = (
    index: number,
    type: 'start' | 'end',
    value: number
  ) => {
    const newValue = JSON.parse(JSON.stringify(values));
    newValue[index][type] = value;
    setValues(newValue);
    !!onChangeMarks && onChangeMarks(newValue);
  };

  const onPlay = (index: number) => {
    let _audioElement = audioElement;
    let _isPlaying = isPlayings[index];
    if (!_audioElement) {
      console.log('get audio');
      _audioElement = new Audio(downloadURL);
      setAudioElement(_audioElement);
    }
    _audioElement.pause();
    setIsPlayings(marks.map((m) => false));

    if (!_isPlaying) {
      _audioElement.currentTime = marks[index].start;
      _audioElement.ontimeupdate = () => {
        !!onChangeAudioEditCurrentTime &&
          onChangeAudioEditCurrentTime(_audioElement!.currentTime);
        if (_audioElement!.currentTime > marks[index].end) {
          _audioElement!.pause();
          setIsPlayings(marks.map((m) => false));
        }
      };
      _audioElement.play();
      setIsPlayings(marks.map((m, i) => index === i));
    }
  };

  return (
    <Table size='small'>
      <TableBody>
        {sentences.map((s, index) => (
          <TableRow key={index}>
            <TableCell padding='none'>
              <IconButton color='primary' onClick={() => onPlay(index)}>
                {isPlayings[index] ? <Pause /> : <PlayArrow />}
              </IconButton>
            </TableCell>
            <TableCell>{s.slice(0, 20)}</TableCell>
            <TableCell sx={{ width: 80 }}>
              <TextField
                label='start'
                size='small'
                type='number'
                value={values[index].start}
                onChange={(e) =>
                  onChangeValue(index, 'start', Number(e.target.value))
                }
              />
            </TableCell>
            <TableCell sx={{ width: 80 }}>
              <TextField
                label='end'
                size='small'
                type='number'
                value={values[index]?.end || 0}
                onChange={(e) =>
                  onChangeValue(index, 'end', Number(e.target.value))
                }
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const useAudioEdit = () => {
  const [audioEditCurrentTime, setAudioEditCurrentTime] = useState(0);
  const [scale, setScale] = useState(50);

  const onChangeAudioEditCurrentTime = useCallback((currentTime: number) => {
    setAudioEditCurrentTime(currentTime);
  }, []);
  const onChangeScale = (scale: number) => {
    setScale(scale);
  };

  return {
    audioEditCurrentTime,
    onChangeAudioEditCurrentTime,
    scale,
    onChangeScale,
  };
};

const ScaleSlider: React.FC<{
  scale: number;
  onChangeScale: (scale: number) => void;
}> = ({ scale, onChangeScale }) => {
  return (
    <Box bgcolor='#efefef' borderRadius={4}>
      <Box mx={2} my={1}>
        <Grid container spacing={2} alignItems='center'>
          <Grid item>
            <Box width={200}>
              <Slider
                value={scale}
                onChange={(e, value) => {
                  if (typeof value === 'number') {
                    onChangeScale(value);
                  }
                }}
              />
            </Box>
          </Grid>
          <Grid item>
            <Box width={70}>
              <TextField
                variant='outlined'
                size='small'
                type='number'
                label='scale'
                value={scale}
                onChange={(e) => onChangeScale(Number(e.target.value))}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
