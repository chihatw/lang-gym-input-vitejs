import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildAccents } from '../../../../entities/Accent';
import { CreateSentence } from '../../../../entities/Sentence';
import { buildTags } from '../../../../entities/Tags';
import { getArticle } from '../../../../repositories/article';
import { createSentences } from '../../../../repositories/sentence';

export const useInitialArticlePage = (id: string) => {
  const navigate = useNavigate();
  const [initializing, setInitializing] = useState(true);
  const [title, setTitle] = useState('');
  const [uid, setUid] = useState('');
  const [japanese, setJapanese] = useState('');
  const [original, setOriginal] = useState('');
  const [kana, setKana] = useState('');
  const [accentString, setAccentString] = useState('');
  const [chinese, setChinese] = useState('');
  const [sentences, setSentences] = useState<CreateSentence[]>([]);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const article = await getArticle(id);
      if (!!article) {
        setTitle(article.title);
        setUid(article.uid);
      }
      setInitializing(false);
    };
    fetchData();
  }, [id]);
  const onChangeUid = (uid: string) => {
    setUid(uid);
  };
  const onChangeJapanese = (japanese: string) => {
    setJapanese(japanese);
  };
  const onChangeOriginal = (original: string) => {
    setOriginal(original);
  };
  const onChangeKana = (kana: string) => {
    setKana(kana);
  };
  const onChangeAccentString = (accentString: string) => {
    setAccentString(accentString);
  };
  const onChangeChinese = (chinese: string) => {
    setChinese(chinese);
  };
  useEffect(() => {
    const accentsArray = accentString
      .split('\n')
      .filter((i) => i)
      .map((s) => buildAccents(s));

    const originalArray = original.split('\n').filter((i) => i);
    const kanaArray = kana.split('\n').filter((i) => i);
    const chineseArray = chinese.split('\n').filter((i) => i);
    setSentences(
      japanese
        .split('\n')
        .filter((i) => i)
        .map((j, index) => ({
          accents: !!accentsArray[index] ? accentsArray[index] : [],
          createdAt: new Date().getTime(),
          end: 0,
          japanese: j,
          line: index,
          article: id,
          start: 0,
          chinese: !!chineseArray[index] ? chineseArray[index] : '',
          kana: !!kanaArray[index] ? kanaArray[index] : '',
          original: !!originalArray[index] ? originalArray[index] : '',
          uid,
          tags: buildTags([
            j,
            !!chineseArray[index] ? chineseArray[index] : '',
            !!kanaArray[index] ? kanaArray[index] : '',
            !!originalArray[index] ? originalArray[index] : '',
          ]),
          title,
        }))
    );

    setIsValid(
      !!japanese &&
        japanese.split('\n').filter((i) => i).length ===
          accentString.split('\n').filter((i) => i).length &&
        japanese.split('\n').filter((i) => i).length ===
          original.split('\n').filter((i) => i).length &&
        japanese.split('\n').filter((i) => i).length ===
          kana.split('\n').filter((i) => i).length &&
        japanese.split('\n').filter((i) => i).length ===
          chinese.split('\n').filter((i) => i).length
    );
  }, [japanese, accentString, id, original, kana, chinese, uid, title]);

  const onSubmit = async () => {
    const { success } = await createSentences(sentences);
    if (success) {
      navigate(`/article/${id}`);
    }
  };

  return {
    initializing,
    title,
    onChangeUid,
    japanese,
    original,
    kana,
    accentString,
    chinese,
    onChangeJapanese,
    onChangeOriginal,
    onChangeKana,
    onChangeAccentString,
    onChangeChinese,
    sentences,
    onSubmit,
    isValid,
  };
};
