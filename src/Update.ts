import { User as FirebaseUser } from 'firebase/auth';
import * as R from 'ramda';
import {
  Article,
  ArticleSentence,
  INITIAL_ARTICLE,
  INITIAL_WORKOUT,
  RandomWorkout,
  State,
  User,
  Workout,
} from './Model';

export const ActionTypes = {
  setUser: 'setUser',
  setState: 'setState',
  setArticle: 'setArticle',
  setWorkout: 'setWorkout',
  deleteArticle: 'deleteArticle',
  startFetching: 'startFetching',
  deleteWorkout: 'deleteWorkout',
  setWorkoutList: 'setWorkoutList',
  setAudioContext: 'setAudioContext',
  setWorkoutSingle: 'setWorkoutSingle',
  setRandomWorkouts: 'setRandomWorkouts',
  toggleIsShowAccents: 'toggleIsShowAccents',
  deleteArticleAudioFile: 'deleteArticleAudioFile',
  uploadArticleAudioFile: 'uploadArticleAudioFile',
};

export type Action = {
  type: string;
  payload?:
    | null
    | State
    | FirebaseUser
    | string
    | User[]
    | Article
    | Article[]
    | Workout
    | Workout[]
    | AudioContext
    | { [key: string]: RandomWorkout }
    | { workout: Workout; users: User[] }
    | { workoutList: Workout[]; users: User[] }
    | { articleId: string; sentence: ArticleSentence }
    | { articleId: string; sentences: ArticleSentence[] }
    | {
        articleId: string;
        sentenceIndex: number;
      }
    | {
        article: Article;
        sentences: ArticleSentence[];
      }
    | {
        article: Article;
        articleBlob: Blob | null;
      }
    | {
        article: Article;
        sentences: ArticleSentence[];
        articleBlob: Blob | null;
      }
    | {
        users: User[];
        article: Article;
        sentences: ArticleSentence[];
        articleBlob: Blob | null;
      };
};

export const reducer = (state: State, action: Action): State => {
  const { type, payload } = action;
  const { articleList, workoutList } = state;

  switch (type) {
    case ActionTypes.setState: {
      const updatedState = payload as State;
      return updatedState;
    }
    case ActionTypes.setRandomWorkouts: {
      const randomWorkouts = payload as { [key: string]: RandomWorkout };
      return R.compose(
        R.assocPath<{ [key: string]: RandomWorkout }, State>(
          ['randomWorkouts'],
          randomWorkouts
        )
      )(state);
    }
    case ActionTypes.toggleIsShowAccents: {
      const articleId = payload as string;
      const article = articleList.find((item) => item.id === articleId);
      if (!article) return state;

      const { isShowAccents } = article;
      const updatedList = articleList.map((item) =>
        item.id == articleId
          ? {
              ...item,
              isShowAccents: !isShowAccents,
            }
          : item
      );
      return R.compose(
        R.assocPath<Article[], State>(['articleList'], updatedList),
        R.assocPath<boolean, State>(
          ['article', 'isShowAccents'],
          !isShowAccents
        ),
        R.assocPath<boolean, State>(
          ['memo', 'articles', articleId, 'isShowAccents'],
          !isShowAccents
        )
      )(state);
    }
    case ActionTypes.setUser: {
      const user = payload as FirebaseUser | null;
      return R.compose(
        R.assocPath<boolean, State>(['initializing'], false),
        R.assocPath<FirebaseUser | null, State>(['user'], user)
      )(state);
    }
    case ActionTypes.setAudioContext: {
      const audioContext = payload as AudioContext | null;
      return R.compose(
        R.assocPath<AudioContext | null, State>(['audioContext'], audioContext)
      )(state);
    }
    case ActionTypes.startFetching: {
      return R.compose(R.assocPath<boolean, State>(['isFetching'], true))(
        state
      );
    }
    case ActionTypes.deleteArticle: {
      const articleId = payload as string;
      const updatedList = articleList.filter((item) => item.id !== articleId);

      return R.compose(
        R.assocPath<Article[], State>(['articleList'], updatedList),
        R.assocPath<Article, State>(['article'], INITIAL_ARTICLE),
        R.assocPath<ArticleSentence[], State>(['sentences'], []),
        R.assocPath<null, State>(['articleBlob'], null),
        R.dissocPath<State>(['memo', 'articles', articleId]),
        R.dissocPath<State>(['memo', 'sentences', articleId]),
        R.dissocPath<State>(['memo', 'articleBlobs', articleId])
      )(state);
    }
    case ActionTypes.setArticle: {
      const { article, sentences, articleBlob } = payload as {
        article: Article;
        sentences: ArticleSentence[];
        articleBlob: Blob | null;
      };

      let updatedList = [...articleList];

      const isCreateNew = !updatedList.find((item) => item.id === article.id);

      if (isCreateNew) {
        updatedList.unshift(article);
      } else {
        updatedList = updatedList.map((item) =>
          item.id === article.id ? article : item
        );
      }

      return R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<Article[], State>(['articleList'], updatedList),
        R.assocPath<Article, State>(['article'], article),
        R.assocPath<Blob | null, State>(['articleBlob'], articleBlob),
        R.assocPath<ArticleSentence[], State>(['sentences'], sentences),
        R.assocPath<Article, State>(['memo', 'articles', article.id], article),
        R.assocPath<Blob | null, State>(
          ['memo', 'articleBlobs', article.id],
          articleBlob
        ),
        R.assocPath<ArticleSentence[], State>(
          ['memo', 'sentences', article.id],
          sentences
        )
      )(state);
    }

    case ActionTypes.setWorkoutList: {
      const { workoutList, users } = payload as {
        workoutList: Workout[];
        users: User[];
      };
      return R.compose(
        R.assocPath<User[], State>(['users'], users),
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<Workout[], State>(['workoutList'], workoutList)
      )(state);
    }
    case ActionTypes.setWorkout: {
      const { workout, users } = payload as { workout: Workout; users: User[] };
      return R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<User[], State>(['users'], users),
        R.assocPath<Workout, State>(['workout'], workout),
        R.assocPath<Workout, State>(['memo', 'workouts', workout.id], workout)
      )(state);
    }
    case ActionTypes.setWorkoutSingle: {
      const workout = payload as Workout;
      let updatedList = [...workoutList];
      const isCreateNew = !updatedList.find((item) => item.id === workout.id);
      if (isCreateNew) {
        updatedList.unshift(workout);
      } else {
        updatedList = updatedList.map((item) =>
          item.id === workout.id ? workout : item
        );
      }
      return R.compose(
        R.assocPath<Workout, State>(['workout'], workout),
        R.assocPath<Workout[], State>(['workoutList'], updatedList),
        R.assocPath<Workout, State>(['memo', 'workouts', workout.id], workout)
      )(state);
    }
    case ActionTypes.deleteWorkout: {
      const workoutIdToDelete = payload as string;
      let updatedList = [...workoutList];

      updatedList = updatedList.filter((item) => item.id !== workoutIdToDelete);

      return R.compose(
        R.assocPath<Workout, State>(['workout'], INITIAL_WORKOUT),
        R.assocPath<Workout[], State>(['workoutList'], updatedList),
        R.dissocPath<State>(['memo', 'workouts', workoutIdToDelete])
      )(state);
    }
    case ActionTypes.uploadArticleAudioFile: {
      const { article, articleBlob } = payload as {
        article: Article;
        articleBlob: Blob | null;
      };
      return R.compose(
        R.assocPath<Article, State>(['article'], article),
        R.assocPath<Blob | null, State>(['articleBlob'], articleBlob),
        R.assocPath<Article, State>(['memo', 'articles', article.id], article),
        R.assocPath<Blob | null, State>(
          ['memo', 'articleBlobs', article.id],
          articleBlob
        )
      )(state);
    }
    case ActionTypes.deleteArticleAudioFile: {
      const { article, sentences } = payload as {
        article: Article;
        sentences: ArticleSentence[];
      };
      return R.compose(
        R.assocPath<Article, State>(['article'], article),
        R.assocPath<Blob | null, State>(['articleBlob'], null),
        R.assocPath<ArticleSentence[], State>(['sentences'], sentences),
        R.assocPath<Article, State>(['memo', 'articles', article.id], article),
        R.assocPath<Blob | null, State>(
          ['memo', 'articleBlobs', article.id],
          null
        ),
        R.assocPath<ArticleSentence[], State>(
          ['memo', 'sentences', article.id],
          sentences
        )
      )(state);
    }

    default:
      return R.compose(R.identity)(state);
  }
};
