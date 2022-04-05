import { Mark } from '../entities/Mark';

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
