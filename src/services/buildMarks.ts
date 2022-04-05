import { Mark } from '../entities/Mark';

const STEP = 0.01; // 0.01秒毎にchannelDataをチェックする
const ACCURANCY = 1000;

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
