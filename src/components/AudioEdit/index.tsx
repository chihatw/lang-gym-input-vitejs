import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import {
  Box,
  Button,
  Grid,
  Slider,
  Table,
  TableBody,
  TextField,
  TableCell,
  TableRow,
  IconButton,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

type Mark = {
  start: number;
  end: number;
};
const AudioEdit: React.FC<{
  downloadURL: string;
  marks: Mark[];
  sentences: string[];
  onDeleteAudio: () => void;
  onChangeMarks: (marks: Mark[]) => void;
  hasChange: boolean;
  onSubmit: () => void;
}> = ({
  downloadURL,
  marks,
  sentences,
  onDeleteAudio,
  onChangeMarks,
  hasChange,
  onSubmit,
}) => {
  const {
    audioEditCurrentTime,
    onChangeAudioEditCurrentTime,
    scale,
    onChangeScale,
  } = useAudioEdit();

  return (
    <div>
      <ScaleSlider scale={scale} onChangeScale={onChangeScale} />

      <div style={{ height: 16 }} />

      <AudioWavePane
        scale={scale}
        downloadURL={downloadURL}
        marks={marks}
        audioEditCurrentTime={audioEditCurrentTime}
        onChangeAudioEditCurrentTime={onChangeAudioEditCurrentTime}
        onChangeMarks={onChangeMarks}
      />

      <div style={{ height: 16 }} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant='contained'
          color='secondary'
          style={{ color: 'white', textTransform: 'none' }}
          onClick={onDeleteAudio}
        >
          delete
        </Button>
      </div>

      <div style={{ height: 16 }} />

      <MarkTable
        sentences={sentences}
        marks={marks}
        downloadURL={downloadURL}
        onChangeMarks={onChangeMarks}
        onChangeAudioEditCurrentTime={onChangeAudioEditCurrentTime}
      />

      <div style={{ height: 16 }} />

      <Button
        variant='contained'
        fullWidth
        disabled={!hasChange}
        onClick={onSubmit}
      >
        送信
      </Button>
    </div>
  );
};

export default AudioEdit;

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

const height = 100;

const AudioWavePane: React.FC<{
  marks: Mark[];
  scale: number;
  downloadURL: string;
  onChangeMarks?: (marks: Mark[]) => void;
  audioEditCurrentTime: number;
  onChangeAudioEditCurrentTime: (currentTime: number) => void;
}> = ({
  marks,
  scale,
  downloadURL,
  onChangeMarks,
  audioEditCurrentTime,
  onChangeAudioEditCurrentTime,
}) => {
  const { channelData, duration, sampleRate } = useAudioWavePane(
    downloadURL,
    scale,
    audioEditCurrentTime
  );

  return (
    <div>
      <AudioEditHeader
        downloadURL={downloadURL}
        duration={duration}
        onChangeAudioEditCurrentTime={onChangeAudioEditCurrentTime}
      />

      <div style={{ height: 16 }} />

      <div
        style={{
          border: '1px solid #eee',
          maxWidth: 600,
          overflow: 'scroll',
          position: 'relative',
        }}
        id='ScrollPane'
      >
        {!!channelData && (
          <>
            <AudioWave
              channelData={channelData}
              scale={scale}
              height={height}
              sampleRate={sampleRate}
            />
            <Lines
              marks={marks}
              duration={duration}
              scale={scale}
              height={height + 4}
            />
            <Line
              scale={scale}
              duration={duration}
              height={height + 4}
              currentTime={audioEditCurrentTime}
            />
          </>
        )}
      </div>

      <div style={{ height: 16 }} />

      <div
        style={{
          color: '#555',
          fontSize: 12,
          padding: '0 8px',
        }}
      >
        <span>Time: </span>
        <span>{Math.round(audioEditCurrentTime * 100) / 100}</span>
      </div>

      {!!channelData && !!onChangeMarks && (
        <>
          <div style={{ height: 16 }} />
          <SliceController
            onChangeMarks={onChangeMarks}
            channelData={channelData}
            sampleRate={sampleRate}
          />
        </>
      )}
    </div>
  );
};

const MarkTable: React.FC<{
  sentences: string[];
  marks: Mark[];
  downloadURL: string;
  onChangeMarks: (marks: Mark[]) => void;
  onChangeAudioEditCurrentTime: (currentTime: number) => void;
}> = ({
  sentences,
  marks,
  downloadURL,
  onChangeMarks,
  onChangeAudioEditCurrentTime,
}) => {
  const { values, onChangeValue, onPlay, isPlayings } = useMarkTable(
    sentences,
    marks,
    onChangeMarks,
    downloadURL,
    onChangeAudioEditCurrentTime
  );

  return (
    <Table size='small'>
      <TableBody>
        {sentences.map((s, index) => (
          <TableRow key={index}>
            <TableCell padding='none'>
              <IconButton color='primary' onClick={() => onPlay(index)}>
                {isPlayings[index] ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
            </TableCell>
            <TableCell>{s.slice(0, 20)}</TableCell>
            <TableCell style={{ width: '18%' }}>
              <TextField
                label='start'
                size='small'
                type='number'
                value={values[index].start}
                InputProps={{ disableUnderline: true }}
                onChange={(e) =>
                  onChangeValue(index, 'start', Number(e.target.value))
                }
              />
            </TableCell>
            <TableCell style={{ width: '18%' }}>
              <TextField
                label='end'
                size='small'
                type='number'
                value={values[index].end}
                InputProps={{ disableUnderline: true }}
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

const useAudioWavePane = (
  downloadURL: string,
  scale: number,
  audioEditCurrentTime: number
) => {
  const [duration, setDuration] = useState(0);
  const [sampleRate, setSampleRate] = useState(0);
  const [channelData, setChannelData] = useState<Float32Array | null>(null);
  useEffect(() => {
    if (!downloadURL) return;
    const context = new window.AudioContext();
    const sampleRate = context.sampleRate;
    setSampleRate(sampleRate);
    const request = new XMLHttpRequest();
    request.open('GET', downloadURL, true);
    request.responseType = 'arraybuffer';
    request.onload = () => {
      context.decodeAudioData(request.response, (buffer) => {
        setChannelData(buffer.getChannelData(0));
        setDuration(
          Math.round(buffer.getChannelData(0).length / (sampleRate / 100)) / 100
        );
      });
    };
    request.send();
  }, [downloadURL]);

  useEffect(() => {
    const scrollPane = document.getElementById('ScrollPane');
    if (!scrollPane) return;
    const width = scrollPane.getBoundingClientRect().width;
    const offset = audioEditCurrentTime * scale - width / 2;
    scrollPane.scrollLeft = offset > 0 ? offset : 0;
  }, [audioEditCurrentTime, scale]);

  return {
    channelData,
    duration,
    sampleRate,
  };
};

const AudioEditHeader: React.FC<{
  downloadURL: string;
  duration: number;
  onChangeAudioEditCurrentTime?: (currentTime: number) => void;
}> = ({ downloadURL, duration, onChangeAudioEditCurrentTime }) => {
  const { isPlaying, currentTime, onPlay, value, onChange } =
    useAudioEditHeader(downloadURL, duration, onChangeAudioEditCurrentTime);
  return (
    <div style={{ color: '#555' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IconButton size='small' color='primary' onClick={onPlay}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>

        <div style={{ width: 16 }} />

        <div>
          <Time seconds={currentTime} />
          <span>/</span>
          <Time seconds={duration} />
        </div>
        <div style={{ width: 16 }} />
        <div style={{ width: 300 }}>
          <Slider
            style={{ paddingTop: 14 }}
            value={value}
            onChange={(e, value) => {
              if (typeof value === 'number') {
                onChange(value);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

const AudioWave: React.FC<{
  scale: number;
  height: number;
  channelData: Float32Array;
  sampleRate: number;
}> = ({ channelData, scale, height, sampleRate }) => {
  useAudioWave({
    color: 'pink',
    height,
    channelData,
    scale,
    sampleRate,
  });
  return <div id='waveWrapper' />;
};

const useAudioWave = ({
  scale,
  height,
  color,
  sampleRate,
  channelData,
}: {
  scale: number;
  color?: string;
  height: number;
  sampleRate: number;
  channelData: Float32Array;
}) => {
  color = color || 'pink';
  useEffect(() => {
    if (!channelData) return;
    const wrapper = document.getElementById('waveWrapper');
    if (!wrapper) return;
    wrapper.innerHTML = '';

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const step = sampleRate / scale!;
    canvas.width = channelData.length / step!;
    canvas.height = height!;

    let peaks = [];
    for (let i = 0; i < channelData.length; i += step!) {
      const fragment = channelData.slice(i, i + step!);
      let peak = 0;
      for (let j = 0; j < fragment.length; j++) {
        if (fragment[j] > peak) {
          peak = fragment[j];
        }
      }
      peaks.push(peak);
    }

    // peaksを相対値にする。
    const max = Math.max.apply(null, peaks);
    peaks = peaks.map((peak) => (peak > 0 ? peak / max : 0));

    peaks.forEach((peak, i) => {
      context!.fillStyle = color!;
      const posX = i;
      const posY = (height! / 2) * (1 - peak);
      const barHeight = height! * peak;
      context!.fillRect(posX, posY, 1, barHeight);
    });
    wrapper.appendChild(canvas);
  }, [channelData, scale, height, color, sampleRate]);
};

const Lines: React.FC<AudioWaveMarksProps> = ({ ...props }) => {
  useAudioWaveMarks({ ...props });
  return (
    <div id='lines' style={{ position: 'absolute', zIndex: -1, top: 0 }} />
  );
};

type AudioWaveMarksProps = {
  marks: Mark[];
  duration: number;
  scale: number;
  height: number;
};

const useAudioWaveMarks = ({
  marks,
  scale,
  duration,
  height,
}: AudioWaveMarksProps) => {
  useEffect(() => {
    const lines = document.getElementById('lines');
    if (!lines) return;
    lines.innerHTML = '';
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = duration * scale;
    canvas.height = height;
    context!.clearRect(0, 0, canvas.width, canvas.height);
    marks.forEach((mark) => {
      context!.fillStyle = 'red';
      context!.fillRect(mark.start * Number(scale), 0, 1, height);
      context!.fillStyle = 'blue';
      context!.fillRect(mark.end * Number(scale), 0, 1, height);
    });
    lines.appendChild(canvas);
  }, [marks, scale, duration, height]);
};

const Line: React.FC<AudioWaveLineProps> = ({ ...props }) => {
  useLine({ ...props });
  return <div id='line' style={{ position: 'absolute', top: 0 }} />;
};

type AudioWaveLineProps = {
  currentTime: number;
  scale: number;
  height: number;
  duration: number;
};

const useLine = ({
  currentTime,
  scale,
  height,
  duration,
}: AudioWaveLineProps) => {
  useEffect(() => {
    const line = document.getElementById('line');
    if (!line) return;
    line.innerHTML = '';
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = duration * scale;
    canvas.height = height;
    context!.clearRect(0, 0, canvas.width, canvas.height);
    context!.fillStyle = 'green';
    context!.fillRect(currentTime * scale, 0, 1, height);
    line.appendChild(canvas);
  }, [currentTime, scale, height, duration]);
};

const SliceController: React.FC<{
  onChangeMarks: (marks: Mark[]) => void;
  channelData: Float32Array;
  sampleRate: number;
}> = ({ onChangeMarks, channelData, sampleRate }) => {
  const {
    value,
    duration,
    accurancy,
    onChangeValue,
    onChangeDuration,
    onChangeAccuracy,
  } = useSliceController({
    sampleRate,
    channelData,
    onChangeMarks,
  });
  return (
    <div style={{ background: '#eee', padding: 8, borderRadius: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 190, paddingLeft: 16 }}>
          <Slider
            value={value}
            onChange={(e, value) => {
              typeof value === 'number' && onChangeValue(value);
            }}
          />
        </div>
        <div style={{ width: 16 }} />
        <CustomTextField
          value={duration}
          label='duration(ms)'
          onChangeValue={onChangeDuration}
        />
        <div style={{ width: 16 }} />
        <CustomTextField
          value={accurancy}
          label='accurancy'
          onChangeValue={onChangeAccuracy}
        />
      </div>
    </div>
  );
};

const useMarkTable = (
  sentences: string[],
  marks: Mark[],
  onChangeMarks?: (marks: Mark[]) => void,
  downloadURL?: string,
  onChangeAudioEditCurrentTime?: (currentTime: number) => void
) => {
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

  return { values, onChangeValue, onPlay, isPlayings };
};

const useAudioEditHeader = (
  downloadURL: string,
  duration: number,
  onChangeAudioEditCurrentTime?: (currentTime: number) => void
) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [value, setValue] = useState(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const [startChangeState, setStartChangeState] = useState({
    isChanging: false,
    isPlaying: false,
  });

  useEffect(() => {
    return () => {
      audioElement && audioElement.pause();
    };
  }, [audioElement]);

  useEffect(() => {
    setValue((currentTime / duration) * 100);
    return () => {};
  }, [currentTime, duration]);

  useEffect(() => {
    !!onChangeAudioEditCurrentTime && onChangeAudioEditCurrentTime(currentTime);
  }, [currentTime, onChangeAudioEditCurrentTime]);

  const onChange = (value: number) => {
    if (typeof value === 'number') {
      if (!startChangeState.isChanging) {
        setStartChangeState({ isChanging: true, isPlaying: isPlaying });
      }
      audioElement && audioElement.pause();
      setIsPlaying(false);
      setValue(value);
      setCurrentTime((duration * value) / 100);

      clearTimeout(timeoutId!);

      const _timeoutId = setTimeout(() => {
        if (startChangeState.isPlaying) {
          onPlay();
        }
        setStartChangeState({ ...startChangeState, isChanging: false });
      }, 500);
      setTimeoutId(_timeoutId);
    }
  };

  const onPlay = () => {
    let _audioElement = audioElement;
    let _isPlaying = isPlaying;
    if (!_audioElement) {
      console.log('get audio');
      _audioElement = new Audio(downloadURL);
      setAudioElement(_audioElement);
    }
    // _audioElement.currentTime = currentTime - 0.5;
    _audioElement.pause();
    setIsPlaying(false);

    if (!_isPlaying) {
      _audioElement.currentTime = currentTime;
      _audioElement.ontimeupdate = () => {
        setCurrentTime(_audioElement!.currentTime);
        if (_audioElement!.currentTime > duration) {
          _audioElement!.pause();
          setIsPlaying(false);
          setCurrentTime(0);
        }
      };
      _audioElement.play();
      setIsPlaying(true);
    }
  };
  return { isPlaying, currentTime, onPlay, value, onChange };
};

const Time: React.FC<{ seconds: number }> = ({ seconds }) => {
  seconds = seconds > 0 ? seconds : 0;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return <span>{`${mins}:${secs < 10 ? '0' : ''}${secs}`}</span>;
};

const useSliceController = ({
  sampleRate,
  channelData,
  onChangeMarks,
}: {
  sampleRate: number;
  channelData: Float32Array;
  onChangeMarks: (marks: Mark[]) => void;
}) => {
  const [value, setValue] = useState(70);
  const [duration, setDuration] = useState(700);
  const [accurancy, setAccuracy] = useState(3);

  useEffect(() => {
    setDuration(value * 10);
  }, [value]);

  useEffect(() => {
    const result: Mark[] = [];
    let hasTmpEnd = false;
    let hasStart = false;
    let start = 0;
    let tmpEnd = 0;
    for (let i = 0; i < channelData.length; i = i + sampleRate * STEP) {
      if (Math.round(channelData[i] * 10 ** accurancy) / 10 ** accurancy < 0) {
        if (hasTmpEnd) {
          if (
            Math.floor(i / (sampleRate / 10)) / 10 - tmpEnd <
            duration / 1000
          ) {
            tmpEnd = Math.ceil(i / (sampleRate / 10)) / 10;
          } else {
            result.push({ start, end: tmpEnd });
            hasTmpEnd = false;
            start = Math.floor(i / (sampleRate / 10)) / 10;
            hasStart = true;
          }
        } else {
          start = Math.floor(i / (sampleRate / 10)) / 10;
          hasStart = true;
        }
      } else {
        if (hasStart && !hasTmpEnd) {
          tmpEnd = Math.ceil(i / (sampleRate / 10)) / 10;
          hasTmpEnd = true;
        }
      }
      if (channelData.length <= i + sampleRate * STEP) {
        if (hasTmpEnd) {
          result.push({ start, end: tmpEnd });
        } else if (hasStart) {
          result.push({
            start,
            end: Math.ceil(channelData.length / (sampleRate / 10)) / 10,
          });
        }
      }
    }
    onChangeMarks(result);
    // eslint-disable-next-line
  }, [duration, channelData]);

  const onChangeValue = (value: number) => {
    setValue(value);
  };
  const onChangeDuration = (duration: number) => {
    setDuration(duration);
    setValue(duration / 10);
  };
  const onChangeAccuracy = (accuracy: number) => {
    setAccuracy(accuracy);
  };

  return {
    value,
    onChangeValue,
    duration,
    onChangeDuration,
    accurancy,
    onChangeAccuracy,
  };
};

const STEP = 0.01; // 0.01秒毎にchannelDataをチェックする

const CustomTextField: React.FC<{
  value: number;
  label: string;
  onChangeValue: (e: number) => void;
}> = ({ value, label, onChangeValue }) => {
  return (
    <div style={{ width: 100 }}>
      <TextField
        variant='outlined'
        size='small'
        label={label}
        type='number'
        value={value}
        onChange={(e) => onChangeValue(Number(e.target.value))}
      />
    </div>
  );
};
