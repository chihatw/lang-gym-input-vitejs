export const buildPeaks = ({
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
