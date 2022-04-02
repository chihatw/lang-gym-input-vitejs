const blob2AudioBuffer = async ({
  data,
  audioContext,
}: {
  data: Blob;
  audioContext: AudioContext;
}): Promise<AudioBuffer | null> => {
  const chunks: Blob[] = [];
  chunks.push(data);
  const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
  const arrayBuffer = await blob.arrayBuffer();
  let audioBuffer = null;
  if (!!arrayBuffer) {
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    audioBufferNormalize(audioBuffer);
  }
  return audioBuffer;
};

export default blob2AudioBuffer;

const audioBufferNormalize = (audioBuffer: AudioBuffer) => {
  const audioData = audioBuffer.getChannelData(0);

  let ymax = 0; // 配列内の最大値
  for (let i = 0; i < audioData.length; i++) {
    const y = Math.abs(audioData[i]);
    y > ymax && (ymax = y);
  }

  for (let i = 0; i < audioData.length; i++) {
    // 最大値に対する比率を計算
    audioData[i] /= ymax;
  }
};
