import getMoras from 'get-moras';
import KANA_ROMAJI_MAP from 'kana-romaji-map';
import { Accent } from '../Model';

type SpecialMora = 'っ' | 'ん' | 'ー' | 'ーん' | 'ーっ';

const SPACE = '　';

export type Rhythm = {
  mora: SpecialMora & '';
  index: number;
  syllable: string;
  disabled: SpecialMora & '' & 'x';
  longVowel?: string;
};

export type WordRhythm = Rhythm[];

export type SentenceRhythm = WordRhythm[];

export const buildRhythmString = (sentenceRhythm: SentenceRhythm) => {
  return sentenceRhythm
    .map((w) =>
      w.map((r) => r.syllable + (!!r.longVowel ? r.longVowel : r.mora)).join('')
    )
    .join(SPACE);
};

// accentsを受け取って、　音節ごとに全空白を入れたひらがな文字列を返す
// accents = [
// {
//   moras: ['い', 'ま', 'は'],
//   pitchPoint: 1,
// },
// {
//   moras: ['て', 'っ', 'きょ', 'ー']
//   pitchPoint: 0,
// }
// ]

// return "いまは　てっきょー"
export const getMoraString = (accents: Accent[]) => {
  return accents
    .map((accent) => accent.moras.map((m) => kanaToHira(m)).join(''))
    .join(SPACE);
};

export const buildSentenceRhythm = (moraString: string) => {
  let index = -1;
  return moraString
    .split(SPACE) // 音節ごとに分ける
    .map((word, wordIndex) => {
      const moras: string[] = getMoras(word); // 拗音は2文字セット、それ以外は1文字に切り分ける
      let syllables: Rhythm[] = [];
      moras.forEach((mora, moraIndex) => {
        index++;
        // ①特殊拍以外のモーラで音節の配列を作る
        // 特殊拍は①の中に含める
        if (!isSpecialMora(mora, moras[moraIndex - 1])) {
          syllables.push({
            syllable: mora,
            index: index + wordIndex,
            mora: getSpecialMora({
              postMora: moras[moraIndex + 1],
              currentMora: mora,
              postPostMora: moras[moraIndex + 2],
            }),
            disabled: '' as never,
            longVowel: getLongVowel(
              mora,
              moras[moraIndex + 1],
              moras[moraIndex + 2]
            ),
          });
        }
      });
      return syllables;
    });
};

const isSpecialMora = (targetMora: string, preTargetMora?: string) => {
  let result = false;
  if (['っ', 'ん', 'ッ', 'ン', 'ー'].includes(targetMora)) {
    result = true;
  } else {
    if (!!preTargetMora) {
      const hiraPreMora = kanaToHira(preTargetMora);
      const preMoraVowel = !!KANA_ROMAJI_MAP[hiraPreMora]
        ? KANA_ROMAJI_MAP[hiraPreMora].slice(-1)
        : '';
      switch (targetMora) {
        case 'あ':
        case 'ア':
          result = ['a'].includes(preMoraVowel);
          break;
        case 'い':
        case 'イ':
          result = ['i', 'e'].includes(preMoraVowel);
          break;
        case 'う':
        case 'ウ':
          result = ['u', 'o'].includes(preMoraVowel);
          break;
        case 'え':
        case 'エ':
          result = ['e'].includes(preMoraVowel);
          break;
        case 'お':
        case 'オ':
          result = ['o'].includes(preMoraVowel);
          break;
        default:
      }
    }
  }
  return result;
};

const getSpecialMora = ({
  postMora,
  currentMora,
  postPostMora,
}: {
  currentMora: string;
  postMora?: string;
  postPostMora?: string;
}): SpecialMora & '' => {
  let result = '';

  if (!!postMora) {
    // 後ろにモーラがある場合
    if (isSpecialMora(postMora, currentMora)) {
      // それが特殊拍の場合
      if (['っ', 'ん', 'ッ', 'ン'].includes(postMora)) {
        // 長音以外は後ろのモーラをそのまま特殊拍とする
        result = postMora;
      } else {
        // 長音の場合、その後ろに「ん」「っ」が続くなら、それも含める
        result =
          'ー' +
          (!!postPostMora && ['ん', 'ン', 'っ', 'ッ'].includes(postPostMora)
            ? postPostMora
            : '');
      }
    }
  }
  return result as never;
};

const getLongVowel = (
  currentMora: string,
  postMora?: string,
  postPostMora?: string
) => {
  let result = '';
  if (!!postMora) {
    // 後ろにモーラがある場合
    if (isSpecialMora(postMora, currentMora)) {
      // それが特殊拍の場合
      if (!['っ', 'ん', 'ッ', 'ン'].includes(postMora)) {
        // 長音の場合、その後ろに「ん」「っ」が続くなら、それも含める
        result =
          postMora +
          (!!postPostMora && ['ん', 'ン', 'っ', 'ッ'].includes(postPostMora)
            ? postPostMora
            : '');
      }
    }
  }
  return result;
};

function kanaToHira(str: string) {
  return str.replace(/[\u30a1-\u30f6]/g, function (match) {
    var chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}
