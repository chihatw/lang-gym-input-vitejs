import { useEffect, useState } from 'react';
import { SpeakerProps } from '..';

export const useSpeaker = ({ start, end, downloadURL }: SpeakerProps) => {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      !!audioElement && audioElement.pause();
    };
  }, [audioElement]);

  const onPlay = () => {
    let _audioElement = audioElement;
    let _isPlaying = isPlaying;
    if (!_audioElement) {
      console.log('get audio');
      _audioElement = new Audio(downloadURL);
      setAudioElement(_audioElement);
    }
    _audioElement.pause();
    setIsPlaying(false);

    if (!_isPlaying) {
      _audioElement.currentTime = start;
      _audioElement.ontimeupdate = () => {
        if (_audioElement!.currentTime > end) {
          _audioElement!.pause();
          setIsPlaying(false);
        }
      };
      _audioElement.play();
      setIsPlaying(true);
    }
  };
  return onPlay;
};
