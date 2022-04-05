import { useNavigate } from 'react-router-dom';
import { getDownloadURL } from 'firebase/storage';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Mark } from '../../../entities/Mark';
import { Sentence } from '../../../entities/Sentence';
import { AppContext } from '../../../services/app';
import { deleteFile, uploadFile } from '../../../repositories/file';
import EditArticleVoicePageComponent from './components/EditArticleVoicePageComponent';
import { Article, useHandleArticles } from '../../../services/useArticles';
import { updateSentences } from '../../../repositories/sentence';
import { buildMarks } from '../../../services/buildMarks';
import { buildSentenceLines } from '../../../services/buildSentenceLines';
import { buildPeaks } from '../../../services/buildPeaks';

// TODO Article Page に 統合？

const INITIAL_BLANK_DURATION = 700;

const EditArticleVoicePage = () => {
  const navigate = useNavigate();
  const { article, isFetching, sentences } = useContext(AppContext);
  const { updateArticle } = useHandleArticles();

  const audioContext = useMemo(() => new AudioContext(), []);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [scale, setScale] = useState(50);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [duration, setDuration] = useState(0);
  const [channelData, setChannelData] = useState<Float32Array | null>(null);
  const [sentenceLines, setSentenceLines] = useState<
    { xPos: number; color: string }[]
  >([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!article) return;
    if (!sentences.length) return;
    if (sentences[0].article !== article.id) {
      console.log('no sentences yet ');
      return;
    }
    const marks = sentences.map((sentence) => ({
      start: sentence.start,
      end: sentence.end,
    }));
    setMarks(marks);
  }, [sentences, article]);

  const handleSetChannelData = useCallback(
    ({
      marks: _marks,
      channelData: _channelData,
    }: {
      marks: Mark[];
      channelData: Float32Array | null;
    }) => {
      let _peaks: number[] = [];
      let _duration = 0;
      let _sentenceLines: {
        xPos: number;
        color: string;
      }[] = [];
      if (!!_channelData) {
        _peaks = buildPeaks({
          scale,
          sampleRate: audioContext.sampleRate,
          channelData: _channelData,
        });
        _duration =
          Math.round(_channelData.length / (audioContext.sampleRate / 100)) /
          100;
        const hasMarks = !!_marks.slice(-1)[0].end; // marks の最後の end が初期値の場合 marks を再設定する
        if (!hasMarks) {
          _marks = buildMarks({
            sampleRate: audioContext.sampleRate,
            channelData: _channelData,
            blankDuration: INITIAL_BLANK_DURATION,
          });
        }
        _sentenceLines = buildSentenceLines({ marks: _marks, scale });
      } else {
        _marks = [];
      }
      setMarks(_marks);
      setPeaks(_peaks);
      setDuration(_duration);
      setChannelData(_channelData);
      setSentenceLines(_sentenceLines);
    },
    [scale, audioContext]
  );

  useEffect(() => {
    return () => {
      handleSetChannelData({ marks, channelData });
    };
  }, []);

  /**
   * article.downloadURL から channelData, duration の取得
   */
  useEffect(() => {
    if (!article.downloadURL) return;
    if (!sentences.length) return;
    if (sentences[0].article !== article.id) return;
    if (!!channelData) return;

    const request = new XMLHttpRequest();

    request.open('GET', article.downloadURL, true);
    request.responseType = 'arraybuffer';
    request.onload = () => {
      audioContext.decodeAudioData(request.response, (buffer) => {
        const channelData = buffer.getChannelData(0);
        const marks = sentences.map((s) => ({ start: s.start, end: s.end }));
        handleSetChannelData({
          marks,
          channelData,
        });
      });
    };
    request.send();
  }, [article, sentences]);

  const onDeleteAudio = async () => {
    if (window.confirm('audioファイルを削除しますか')) {
      const path = decodeURIComponent(
        article.downloadURL.split('/')[7].split('?')[0]
      );
      const { success } = await deleteFile(path);
      if (success) {
        const _sentences: Sentence[] = sentences.map((s) => ({
          ...s,
          start: 0,
          end: 0,
        }));
        const { success } = await updateSentences(_sentences);
        if (success) {
          const newArticle: Article = { ...article, downloadURL: '' };
          const { success } = await updateArticle(newArticle);
          if (success) {
            navigate('/article/list');
          }
        }
      }
    }
  };

  const onChangeMarks = (marks: Mark[]) => {
    setMarks(marks);
  };

  const onSubmit = async () => {
    const _sentences: Sentence[] = sentences.map((s, index) => ({
      ...s,
      start: marks[index].start,
      end: marks[index].end,
    }));
    const { success } = await updateSentences(_sentences);
    if (success) {
      navigate(`/article/${article.id}`);
    }
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const { success, snapshot } = await uploadFile(file, 'articles');
    if (!!success && !!snapshot) {
      const url = await getDownloadURL(snapshot.ref);
      const newArticle: Article = {
        ...article!,
        downloadURL: url,
      };
      updateArticle(newArticle);
    }
  };

  const handleChangeBlankDuration = (blankDuration: number) => {
    if (!channelData) return;
    const marks = buildMarks({
      channelData,
      blankDuration,
      sampleRate: audioContext.sampleRate,
    });
    setMarks(marks);
    const sentenceLines = buildSentenceLines({ marks, scale });
    console.log('set sentenceLines');
    setSentenceLines(sentenceLines);
  };

  const handlePlay = () => {
    let _audioElement = audioElement;
    let _isPlaying = isPlaying;
    if (!_audioElement) {
      console.log('get audio');
      _audioElement = new Audio(article.downloadURL);
      setAudioElement(_audioElement);
    }
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

  if (isFetching) {
    return <></>;
  } else {
    return (
      <EditArticleVoicePageComponent
        peaks={peaks}
        marks={marks}
        article={article}
        duration={duration}
        sentences={sentences.map((sentence) => sentence.japanese)}
        blankDuration={INITIAL_BLANK_DURATION}
        currentTime={currentTime}
        sentenceLines={sentenceLines}
        isPlaying={isPlaying}
        onUpload={onUpload}
        onSubmit={onSubmit}
        onChangeMarks={onChangeMarks}
        onDeleteAudio={onDeleteAudio}
        handlePlay={handlePlay}
        handleChangeBlankDuration={handleChangeBlankDuration}
      />
    );
  }
};

export default EditArticleVoicePage;
