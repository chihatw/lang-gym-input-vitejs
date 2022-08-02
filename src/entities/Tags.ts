import { Tags } from '../Model';

export const buildTags = (linesArray: string[]) => {
  const tags: Tags = {};
  linesArray.forEach((lines) => {
    lines.split('\n').forEach((line) => {
      Array.from(line).forEach((_, i) => {
        // uni-gram
        tags[line.slice(i, i + 1)] = true;
        // bi-gram
        if (i + 1 < line.length) {
          tags[line.slice(i, i + 2)] = true;
        }
      });
    });
  });
  return tags;
};
