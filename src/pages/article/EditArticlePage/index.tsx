import { useNavigate } from 'react-router-dom';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Divider } from '@mui/material';

import { AppContext } from '../../../services/app';
import { Mark } from '../../../entities/Mark';
import { Sentence } from '../../../services/useSentences';
import { buildPeaks } from '../../../services/buildPeaks';
import { buildMarks } from '../../../services/buildMarks';
import { getDownloadURL } from 'firebase/storage';
import { updateSentences } from '../../../repositories/sentence';
import { buildSentenceLines } from '../../../services/buildSentenceLines';
import EditArticlePageComponent from './components/EditArticlePageComponent';
import { deleteFile, uploadFile } from '../../../repositories/file';
import EditArticleVoicePageComponent from './components/EditArticleVoicePageComponent';
import {
  Article,
  INITIAL_ARTICLE,
  useHandleArticles,
} from '../../../services/useArticles';

const CANVAS_WIDTH = 580;
const INITIAL_BLANK_DURATION = 700;

const EditArticlePage = () => {
  const navigate = useNavigate();
  const { addArticle, updateArticle } = useHandleArticles();
  const { users, article, sentences, isFetching, setArticleId, setIsFetching } =
    useContext(AppContext);

  const audioContext = useMemo(() => new AudioContext(), []);

  const [uid, setUid] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState('');
  const [embedId, setEmbedId] = useState('');
  const [articleMarksString, setArticleMarksString] = useState('hello');

  const [scale, setScale] = useState(5);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [channelData, setChannelData] = useState<Float32Array | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [sentenceAudioMarks, setSentenceAudioMarks] = useState<Mark[]>([]);
  const [sentenceLines, setSentenceLines] = useState<
    { xPos: number; color: string }[]
  >([]);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );

  useEffect(() => {
    if (!users.length) return;
    setUid(users[0].id);
  }, [users]);

  // フォームの初期値設定
  useEffect(() => {
    if (!article.id) return;
    setUid(article.uid);
    setDate(new Date(article.createdAt));
    setTitle(article.title);
    setEmbedId(article.embedID);
    if (!sentences) return;
    const lines: string[] = [];
    sentences.forEach(({ japanese }, index) => {
      const items: string[] = [];
      const mark = article.marks[index];
      const initial = index === 0 ? '' : '0:00';
      items.push(mark || initial);
      const hasMore = japanese.length > 5 ? '…' : '';
      items.push(japanese.slice(0, 5) + hasMore);
      const line = items.join(' ');
      lines.push(line);
    });
    const marksString = lines.join('\n');
    setArticleMarksString(marksString);
  }, [article, sentences]);

  /**
   * sentences から marks 抽出
   */
  useEffect(() => {
    if (!article || !sentences.length || sentences[0].article !== article.id)
      return;
    const marks = sentences.map(({ end, start }) => ({
      end,
      start,
    }));
    handleSetSentenceAudioMarks({ marks, scale });
  }, [sentences, article]);

  /**
   * article.downloadURL から channelData を取得
   */
  useEffect(() => {
    if (
      !article.downloadURL ||
      !sentences.length ||
      sentences[0].article !== article.id ||
      !!channelData
    )
      return;

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

  /**
   * marks をセットするときに、sentenceLines もセットする
   */
  const handleSetSentenceAudioMarks = useCallback(
    ({ marks: _marks, scale: _scale }: { marks: Mark[]; scale: number }) => {
      setSentenceAudioMarks(_marks);
      const _sentenceLines = buildSentenceLines({
        marks: _marks,
        scale: _scale,
      });
      setSentenceLines(_sentenceLines);
    },
    []
  );

  /**
   * channelData をセットする時に、 scale, marks, peaks, duration もセットする
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
      let _duration = 0;
      if (!!_channelData) {
        const _scale =
          (CANVAS_WIDTH * audioContext.sampleRate) / _channelData.length;
        setScale(_scale);
        _peaks = buildPeaks({
          scale: _scale,
          sampleRate: audioContext.sampleRate,
          channelData: _channelData,
        });
        _duration =
          Math.round(_channelData.length / (audioContext.sampleRate / 100)) /
          100;
        const hasMarks = !!_marks.slice(-1)[0]?.end; // marks の最後の end が初期値の場合 marks を再設定する
        if (!hasMarks) {
          _marks = buildMarks({
            sampleRate: audioContext.sampleRate,
            channelData: _channelData,
            blankDuration: INITIAL_BLANK_DURATION,
          });
        }
        handleSetSentenceAudioMarks({ marks: _marks, scale: _scale });
      } else {
        handleSetSentenceAudioMarks({ marks: [], scale });
      }
      setPeaks(_peaks);
      setDuration(_duration);
      setChannelData(_channelData);
    },
    [audioContext]
  );

  const handlePickDate = (date: Date | null) => {
    !!date && setDate(date);
  };

  const handleChangeTitle = (value: string) => {
    setTitle(value);
  };

  const handleChangeUid = (uid: string) => {
    setUid(uid);
  };
  const handleChangeEmbedId = (value: string) => {
    setEmbedId(value);
  };
  const handleChangeArticleMarksString = (value: string) => {
    setArticleMarksString(value);
  };

  const create = async () => {
    const { id, ...omitted } = INITIAL_ARTICLE;

    const article: Omit<Article, 'id'> = {
      ...omitted,
      uid,
      title,
      createdAt: date.getTime(),
      userDisplayname: users.filter((u) => u.id === uid)[0].displayname,
    };
    const { success, articleId } = await addArticle(article);
    if (success) {
      setIsFetching(true);
      setArticleId(articleId!);
      navigate(`/article/${articleId!}/initial`);
    }
  };

  const buildArticleMarks = (value: string) => {
    let articleMarks: string[] = [];
    const lines = value.split('\n');
    lines.forEach((line) => {
      const items = line.split(' ');
      articleMarks.push(items[0]);
    });
    return articleMarks;
  };

  const update = async () => {
    const articleMarks = buildArticleMarks(articleMarksString);

    const newArticle: Article = {
      ...article,
      uid,
      marks: articleMarks,
      title,
      embedID: embedId,
      createdAt: date.getTime(),
      userDisplayname: users.filter((u) => u.id === uid)[0].displayname,
    };
    const { success } = await updateArticle(newArticle);
    if (success) {
      navigate('/article/list');
    }
  };

  const handleClickSubmit = () => {
    if (!!article.id) {
      update();
    } else {
      create();
    }
  };

  const handlePlayMarkRow = (index: number) => {
    let _audioElement = audioElement;
    if (!_audioElement) {
      console.log('get audio');
      _audioElement = new Audio(article.downloadURL);
      setAudioElement(_audioElement);
    }
    _audioElement.pause();
    _audioElement.currentTime = sentenceAudioMarks[index].start;
    _audioElement.ontimeupdate = () => {
      setCurrentTime(_audioElement!.currentTime);
      if (_audioElement!.currentTime > sentenceAudioMarks[index].end) {
        _audioElement!.pause();
      }
    };
    _audioElement.play();
  };

  const handleChangeBlankDuration = (blankDuration: number) => {
    if (!channelData) return;
    const marks = buildMarks({
      channelData,
      blankDuration,
      sampleRate: audioContext.sampleRate,
    });
    handleSetSentenceAudioMarks({ marks, scale });
  };

  const handleChangeEnd = ({ index, end }: { index: number; end: number }) => {
    const clonedMarks = [...sentenceAudioMarks];
    clonedMarks[index] = { ...clonedMarks[index], end };
    handleSetSentenceAudioMarks({ marks: clonedMarks, scale });
  };

  const handleChangeStart = ({
    index,
    start,
  }: {
    index: number;
    start: number;
  }) => {
    const clonedMarks = [...sentenceAudioMarks];
    clonedMarks[index] = { ...clonedMarks[index], start };
    handleSetSentenceAudioMarks({ marks: clonedMarks, scale });
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

  const handleUploadAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const { success, snapshot } = await uploadFile(file, 'articles');
    if (!!success && !!snapshot) {
      const url = await getDownloadURL(snapshot.ref);
      const newArticle: Article = {
        ...article,
        downloadURL: url,
      };
      updateArticle(newArticle);
    }
  };

  const handleDeleteAudio = async () => {
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
          await updateArticle(newArticle);
        }
      }
    }
  };

  const updateSentenceAudioMarks = async () => {
    const newSentences: Sentence[] = sentences.map((senetence, index) => ({
      ...senetence,
      start: sentenceAudioMarks[index].start,
      end: sentenceAudioMarks[index].end,
    }));
    const { success } = await updateSentences(newSentences);
    if (success) {
      navigate(`/article/list`);
    }
  };

  if (isFetching) {
    return <></>;
  } else {
    return (
      <div style={{ display: 'grid', rowGap: 16, paddingBottom: 120 }}>
        <EditArticlePageComponent
          uid={uid}
          date={date}
          title={title}
          users={users}
          embedId={embedId}
          articleId={article.id}
          articleMarksString={articleMarksString}
          handlePickDate={handlePickDate}
          handleChangeUid={handleChangeUid}
          handleClickSubmit={handleClickSubmit}
          handleChangeTitle={handleChangeTitle}
          handleChangeEmbedId={handleChangeEmbedId}
          handleChangeArticleMarksString={handleChangeArticleMarksString}
        />
        {!!article.id && (
          <>
            <Divider />
            <EditArticleVoicePageComponent
              peaks={peaks}
              marks={sentenceAudioMarks}
              labels={sentences.map((sentence) =>
                sentence.japanese.slice(0, 20)
              )}
              hasMarks={!!sentences.slice(-1)[0]?.end}
              scale={scale}
              article={article}
              duration={duration}
              isPlaying={isPlaying}
              currentTime={currentTime}
              sentenceLines={sentenceLines}
              blankDuration={INITIAL_BLANK_DURATION}
              handlePlay={handlePlay}
              updateMarks={updateSentenceAudioMarks}
              handleChangeEnd={handleChangeEnd}
              handleUploadAudio={handleUploadAudio}
              handleDeleteAudio={handleDeleteAudio}
              handleChangeStart={handleChangeStart}
              handlePlayMarkRow={handlePlayMarkRow}
              handleChangeBlankDuration={handleChangeBlankDuration}
            />
          </>
        )}
      </div>
    );
  }
};

export default EditArticlePage;
