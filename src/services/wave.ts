import React from 'react';
import { ArticleSentence, Mark } from '../Model';
import {
  ArticleVoiceState,
  INITIAL_ARTICLE_VOICE_STATE,
} from '../pages/Article/EditArticlePage/Model';
import { blobToAudioBuffer } from './utils';

const CANVAS_WIDTH = 550;
const INITIAL_BLANK_DURATION = 700;

const STEP = 0.01; // 0.01秒毎にchannelDataをチェックする
const ACCURANCY = 1000;

export const buildArticleVoiceState = async ({
  blob,
  sentences,
  audioContext,
}: {
  blob: Blob;
  sentences: ArticleSentence[];
  audioContext: AudioContext;
}): Promise<{ wave: ArticleVoiceState; sentences: ArticleSentence[] }> => {
  let scale = 0;
  let peaks: number[] = [];
  let hasMarks = false;
  let duration = 0;
  let channelData: Float32Array | null = null;
  let blankDuration = INITIAL_BLANK_DURATION;

  for (const sentence of sentences) {
    if (sentence.end !== 0) {
      hasMarks = true;
    }
  }

  const buffer = await blobToAudioBuffer(blob, audioContext);
  channelData = buffer.getChannelData(0);
  if (!channelData) return { wave: INITIAL_ARTICLE_VOICE_STATE, sentences };

  scale = (CANVAS_WIDTH * audioContext.sampleRate) / channelData.length;
  peaks = buildPeaks({
    scale,
    sampleRate: audioContext.sampleRate,
    channelData,
  });
  if (!hasMarks) {
    const marks = buildMarks({
      sampleRate: audioContext.sampleRate,
      channelData,
      blankDuration,
    });
    for (let i = 0; i < sentences.length; i++) {
      sentences[i].start = marks[i]?.start || 0;
      sentences[i].end = marks[i]?.end || 0;
    }
  }
  duration = peaks.length / scale;
  return {
    wave: {
      scale,
      peaks,
      duration,
      channelData,
      blankDuration,
    },
    sentences,
  };
};

const buildPeaks = ({
  scale,
  sampleRate,
  channelData,
}: {
  scale: number;
  sampleRate: number;
  channelData: Float32List;
}) => {
  const step = sampleRate / scale;
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
  return peaks;
};

export const buildMarks = ({
  sampleRate,
  channelData,
  blankDuration,
}: {
  sampleRate: number;
  channelData: Float32Array;
  blankDuration: number;
}) => {
  const result: Mark[] = [];

  // フラグ
  let hasStart = false;
  let hasTmpEnd = false;

  let start = 0;
  let tmpEnd = 0;
  // sampleRateずつ、ステップすれば、channelData 1秒毎に抽出
  // STEP は 0.01 なので、 0.01秒毎に抽出
  const step = sampleRate * STEP;

  for (let i = 0; i < channelData.length; i += step) {
    // 1. 抽出したデータに音がある場合
    if (Math.round(channelData[i] * ACCURANCY) / ACCURANCY < 0) {
      // 1-1. エンドフラグが立っている場合
      if (hasTmpEnd) {
        // 現行のエンドポイントと現在抽出しているデータの間隔
        const separation =
          (Math.floor(i / (sampleRate / 10)) / 10 - tmpEnd) * 1000;
        // 1-1-1. 間隔が指定 blankDuration(ms) よりも狭い場合、エンドポイントを更新する
        if (separation < blankDuration) {
          tmpEnd = Math.ceil(i / (sampleRate / 10)) / 10;
        }
        // 1-1-2. 間隔が指定 blankDuration(ms) よりも広い場合
        else {
          result.push({ start, end: tmpEnd });
          hasTmpEnd = false;
          start = Math.floor(i / (sampleRate / 10)) / 10;
          hasStart = true;
        }
      }
      // 1-2. エンドフラグが立っていない場合
      else {
        start = Math.floor(i / (sampleRate / 10)) / 10;
        // スタートフラグを立てる
        hasStart = true;
      }
    } else {
      /**
       * 2. 抽出したデータに音がない場合
       * */
      // 2-1. すでにスタートフラグが立っていて、まだエンドフラグが立っていない場合
      if (hasStart && !hasTmpEnd) {
        tmpEnd = Math.ceil(i / (sampleRate / 10)) / 10;
        // エンドフラグを立てる
        hasTmpEnd = true;
      }
      // 2-2. スタートフラグが立っていない場合は、何もしない。
    }

    // ??
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
  return result;
};

export const buildSentenceLines = ({
  marks,
  scale,
}: {
  marks: Mark[];
  scale: number;
}) => {
  const sentenceLines: { xPos: number; color: string }[] = [];
  for (const mark of marks) {
    const startLine = {
      xPos: Math.round(mark.start * scale),
      color: 'red',
    };
    const endLine = {
      xPos: Math.round(mark.end * scale),
      color: 'blue',
    };
    sentenceLines.push(startLine);
    sentenceLines.push(endLine);
  }
  return sentenceLines;
};
