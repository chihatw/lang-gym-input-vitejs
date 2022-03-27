import { buildArticle, Article } from '../../../../entities/Article';
import { db } from '../../../../repositories/firebase';

export const usePatchPage = () => {
  const articlesRef = db.collection('articles');
  const onClick_A = async () => {
    const snapshot = await articlesRef.get();
    if (!!snapshot) {
      const newArticles: Article[] = snapshot.docs.map((doc) => ({
        ...buildArticle(doc.id, doc.data()),
        marks: [],
      }));

      const batch = db.batch();
      try {
        newArticles.forEach((newArticle) => {
          const { id, ...omittedNewArticle } = newArticle;
          batch.update(articlesRef.doc(id), omittedNewArticle);
        });
        batch.commit();
      } catch (e) {
        console.warn(e);
      }
    } else {
      console.log('empty');
    }
  };
  return { onClick_A };
};
