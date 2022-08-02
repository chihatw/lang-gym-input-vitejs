import * as R from 'ramda';
import {
  Article,
  ArticleSentence,
  ArticleSentenceForm,
  INITIAL_ARTICLE,
  State,
  User,
  Workout,
} from './Model';

export const ActionTypes = {
  setUsers: 'setUsers',
  setArticle: 'setArticle',
  setWorkout: 'setWorkout',
  startFetching: 'startFetching',
  setArticleList: 'setArticleList',
  setWorkoutList: 'setWorkoutList',
  initialArticle: 'initialArticle',
  setArticleForm: 'setArticleForm',
};

export type Action = {
  type: string;
  payload?:
    | string
    | User[]
    | Article[]
    | Workout[]
    | { workout: Workout; users: User[] }
    | {
        article: Article;
        sentences: ArticleSentence[];
        articleSentenceForms: ArticleSentenceForm[];
      }
    | {
        users: User[];
        article: Article;
        sentences: ArticleSentence[];
        articleSentenceForms: ArticleSentenceForm[];
      };
};

export const reducer = (state: State, action: Action): State => {
  const { type, payload } = action;
  switch (type) {
    case ActionTypes.initialArticle: {
      return R.compose(
        R.assocPath<boolean, State>(['isFetching'], true),
        R.assocPath<Article, State>(['article'], INITIAL_ARTICLE),
        R.assocPath<ArticleSentence[], State>(['sentences'], []),
        R.assocPath<ArticleSentenceForm[], State>(['articleSentenceForms'], [])
      )(state);
    }
    case ActionTypes.startFetching: {
      return R.compose(R.assocPath<boolean, State>(['isFetching'], true))(
        state
      );
    }
    case ActionTypes.setArticleList: {
      const articleList = payload as Article[];
      return R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<Article[], State>(['articleList'], articleList)
      )(state);
    }
    case ActionTypes.setUsers: {
      const users = payload as User[];
      return R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<User[], State>(['users'], users)
      )(state);
    }
    case ActionTypes.setArticle: {
      const { article, sentences, articleSentenceForms } = payload as {
        article: Article;
        sentences: ArticleSentence[];
        articleSentenceForms: ArticleSentenceForm[];
      };
      return R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<Article, State>(['article'], article),
        R.assocPath<ArticleSentence[], State>(['sentences'], sentences),
        R.assocPath<ArticleSentenceForm[], State>(
          ['articleSentenceForms'],
          articleSentenceForms
        ),
        R.assocPath<Article, State>(['memo', 'articles', article.id], article),
        R.assocPath<ArticleSentence[], State>(
          ['memo', 'sentences', article.id],
          sentences
        ),
        R.assocPath<ArticleSentenceForm[], State>(
          ['memo', 'articleSentenceForms', article.id],
          articleSentenceForms
        )
      )(state);
    }
    case ActionTypes.setArticleForm: {
      const { users, article, sentences, articleSentenceForms } = payload as {
        users: User[];
        article: Article;
        sentences: ArticleSentence[];
        articleSentenceForms: ArticleSentenceForm[];
      };
      return R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<User[], State>(['users'], users),
        R.assocPath<Article, State>(['article'], article),
        R.assocPath<ArticleSentence[], State>(['sentences'], sentences),
        R.assocPath<ArticleSentenceForm[], State>(
          ['articleSentenceForms'],
          articleSentenceForms
        ),
        R.assocPath<Article, State>(['memo', 'articles', article.id], article),
        R.assocPath<ArticleSentence[], State>(
          ['memo', 'sentences', article.id],
          sentences
        ),
        R.assocPath<ArticleSentenceForm[], State>(
          ['memo', 'articleSentenceForms', article.id],
          articleSentenceForms
        )
      )(state);
    }

    case ActionTypes.setWorkoutList: {
      const workoutList = payload as Workout[];
      return R.compose(
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
    default:
      return R.compose(R.identity)(state);
  }
};
