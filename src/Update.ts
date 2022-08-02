import { User as FirebaseUser } from 'firebase/auth';
import * as R from 'ramda';
import {
  Article,
  ArticleSentence,
  ArticleSentenceForm,
  INITIAL_ARTICLE,
  INITIAL_QUESTION_SET,
  Question,
  QuestionSet,
  State,
  User,
  Workout,
} from './Model';

export const ActionTypes = {
  setUser: 'setUser',
  setQuiz: 'setQuiz',
  setUsers: 'setUsers',
  submitQuiz: 'submitQuiz',
  setArticle: 'setArticle',
  setWorkout: 'setWorkout',
  deleteQuiz: 'deleteQuiz',
  setQuizList: 'setQuizList',
  startFetching: 'startFetching',
  setArticleList: 'setArticleList',
  setWorkoutList: 'setWorkoutList',
  initialArticle: 'initialArticle',
  setArticleForm: 'setArticleForm',
  setAudioContext: 'setAudioContext',
};

export type Action = {
  type: string;
  payload?:
    | null
    | FirebaseUser
    | string
    | User[]
    | Article[]
    | Workout[]
    | QuestionSet[]
    | AudioContext
    | { workout: Workout; users: User[] }
    | {
        quiz: QuestionSet;
        questions: Question[];
      }
    | {
        quiz: QuestionSet;
        users: User[];
        questions: Question[];
        quizBlob: Blob | null;
      }
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
  const { quizList } = state;
  switch (type) {
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
    case ActionTypes.setQuizList: {
      const quizList = payload as QuestionSet[];
      return R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<QuestionSet[], State>(['quizList'], quizList)
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
    case ActionTypes.setQuiz: {
      const { quiz, users, questions, quizBlob } = payload as {
        quiz: QuestionSet;
        users: User[];
        quizBlob: Blob | null;
        questions: Question[];
      };
      return R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<User[], State>(['users'], users),
        R.assocPath<QuestionSet, State>(['quiz'], quiz),
        R.assocPath<Blob | null, State>(['quizBlob'], quizBlob),
        R.assocPath<Question[], State>(['questions'], questions),
        R.assocPath<QuestionSet, State>(['memo', 'quizzes', quiz.id], quiz),
        R.assocPath<Blob | null, State>(
          ['memo', 'quizBlobs', quiz.id],
          quizBlob
        ),
        R.assocPath<Question[], State>(
          ['memo', 'questions', quiz.id],
          questions
        )
      )(state);
    }
    case ActionTypes.submitQuiz: {
      const { quiz, questions } = payload as {
        quiz: QuestionSet;
        questions: Question[];
      };

      let isCreateNew = !quizList.find((item) => item.id === quiz.id);
      let updatedQuizList = [...quizList];
      if (isCreateNew) {
        updatedQuizList.unshift(quiz);
      } else {
        updatedQuizList = updatedQuizList.map((item) =>
          item.id === quiz.id ? quiz : item
        );
      }

      return R.compose(
        R.assocPath<QuestionSet, State>(['quiz'], quiz),
        R.assocPath<QuestionSet, State>(['memo', 'quizzes', quiz.id], quiz),
        R.assocPath<Question[], State>(['questions'], questions),
        R.assocPath<Question[], State>(
          ['memo', 'questions', quiz.id],
          questions
        ),
        R.assocPath<QuestionSet[], State>(['quizList'], updatedQuizList)
      )(state);
    }
    case ActionTypes.deleteQuiz: {
      const questionSetId = payload as string;
      const updatedQuizList = quizList.filter(
        (quiz) => quiz.id !== questionSetId
      );
      return R.compose(
        R.assocPath<QuestionSet[], State>(['quizList'], updatedQuizList),
        R.assocPath<QuestionSet, State>(['quiz'], INITIAL_QUESTION_SET),
        R.assocPath<null, State>(['quizBlob'], null),
        R.assocPath<Question[], State>(['questions'], []),
        R.dissocPath<State>(['memo', 'quizzes', questionSetId]),
        R.dissocPath<State>(['memo', 'quizBlobs', questionSetId]),
        R.dissocPath<State>(['memo', 'questions', questionSetId])
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
