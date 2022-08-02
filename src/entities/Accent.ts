import getMoras from 'get-moras';
import { Accent } from '../Model';

export const buildAccentString = (accents: Accent[]) => {
  return accents
    .map((a) => {
      let result = '';
      a.moras.forEach((m, index) => {
        result += m;
        if (a.pitchPoint === index + 1) {
          result += '＼';
        }
      });
      return result;
    })
    .join('　');
};

export const buildAccents = (accentString: string): Accent[] => {
  return accentString.split('　').map((a) => {
    const moras = getMoras(a);
    const indexOfAccent = moras.indexOf('＼');
    return {
      moras: moras.filter((m) => m !== '＼'),
      pitchPoint: indexOfAccent > 0 ? indexOfAccent : 0,
    };
  });
};
