import { useNavigate } from 'react-router-dom';
import { getDownloadURL } from 'firebase/storage';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Mark } from '../../../entities/Mark';
import { buildPeaks } from '../../../services/buildPeaks';
import { buildMarks } from '../../../services/buildMarks';
import { deleteFile, uploadFile } from '../../../repositories/file';
import EditArticleVoicePaneComponent from './EditArticleVoicePaneComponent';
import { Article, useHandleArticles } from '../../../services/useArticles';
import { Sentence, useHandleSentences } from '../../../services/useSentences';

const CANVAS_WIDTH = 550;
const INITIAL_BLANK_DURATION = 700;

const EditArticleVoicePane = ({
  article,
  sentences,
}: {
  article: Article;
  sentences: Sentence[];
}) => {
  const navigate = useNavigate();

  const audioContext = useMemo(() => new AudioContext(), []);

  const { updateArticle } = useHandleArticles();
  const { updateSentences } = useHandleSentences();
  const [scale, setScale] = useState(5);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [channelData, setChannelData] = useState<Float32Array | null>(null);

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
    setMarks(marks);
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
        const marks = sentences.map(({ start, end }) => ({ start, end }));
        handleSetChannelData({
          marks,
          channelData,
        });
      });
    };
    request.send();
  }, [article, sentences]);

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
        const newSentences = sentences.map((sentence) => ({
          ...sentence,
          end: 0,
          start: 0,
        }));
        const { success } = await updateSentences(newSentences);
        if (success) {
          const newArticle = { ...article, downloadURL: '' };
          await updateArticle(newArticle);
        }
      }
    }
  };

  const updateMarks = async () => {
    const newSentences: Sentence[] = sentences.map((senetence, index) => ({
      ...senetence,
      start: marks[index].start,
      end: marks[index].end,
    }));
    const { success } = await updateSentences(newSentences);
    if (success) {
      navigate(`/article/list`);
    }
  };

  return (
    <EditArticleVoicePaneComponent
      peaks={peaks}
      marks={marks}
      scale={scale}
      labels={sentences.map((sentence) => sentence.japanese.slice(0, 20))}
      article={article}
      hasMarks={!!sentences.slice(-1)[0]?.end}
      blankDuration={INITIAL_BLANK_DURATION}
      updateMarks={updateMarks}
      handleChangeEnd={handleChangeEnd}
      handleUploadAudio={handleUploadAudio}
      handleDeleteAudio={handleDeleteAudio}
      handleChangeStart={handleChangeStart}
      handleChangeBlankDuration={handleChangeBlankDuration}
    />
  );
};

export default EditArticleVoicePane;
