import { User as FirebaseUser } from 'firebase/auth';
import * as R from 'ramda';
import {
  Article,
  ArticleSentence,
  ArticleSentenceForm,
  INITIAL_ARTICLE,
  INITIAL_WORKOUT,
  Question,
  QuestionSet,
  RandomWorkout,
  State,
  User,
  Workout,
} from './Model';
import { Quiz } from './pages/TempPage/service';

export const ActionTypes = {
  setUser: 'setUser',
  setQuiz: 'setQuiz',
  setUsers: 'setUsers',
  setState: 'setState',
  submitQuiz: 'submitQuiz',
  setArticle: 'setArticle',
  setWorkout: 'setWorkout',
  deleteQuiz: 'deleteQuiz',
  deleteArticle: 'deleteArticle',
  startFetching: 'startFetching',
  deleteWorkout: 'deleteWorkout',
  setArticleList: 'setArticleList',
  setWorkoutList: 'setWorkoutList',
  initialArticle: 'initialArticle',
  updateSentence: 'updateSentence',
  setArticleForm: 'setArticleForm',
  updateSentences: 'updateSentences',
  setAudioContext: 'setAudioContext',
  setWorkoutSingle: 'setWorkoutSingle',
  setArticleSingle: 'setArticleSingle',
  setRandomWorkouts: 'setRandomWorkouts',
  toggleIsShowParses: 'toggleIsShowParses',
  toggleIsShowAccents: 'toggleIsShowAccents',
  deleteArticleAudioFile: 'deleteArticleAudioFile',
  uploadArticleAudioFile: 'uploadArticleAudioFile',
  setArticleSentenceForm: 'setArticleSentenceForm',
};

export type Action = {
  type: string;
  payload?:
    | null
    | Quiz
    | State
    | FirebaseUser
    | string
    | User[]
    | Article
    | Article[]
    | Workout
    | Workout[]
    | QuestionSet[]
    | AudioContext
    | { [key: string]: RandomWorkout }
    | { workout: Workout; users: User[] }
    | { workoutList: Workout[]; users: User[] }
    | { articleId: string; sentence: ArticleSentence }
    | { articleId: string; sentences: ArticleSentence[] }
    | {
        quiz: QuestionSet;
        questions: Question[];
      }
    | {
        articleId: string;
        sentenceIndex: number;
        articleSentenceForm: ArticleSentenceForm;
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
      }
    | {
        article: Article;
        articleBlob: Blob | null;
      }
    | {
        article: Article;
        sentences: ArticleSentence[];
        articleBlob: Blob | null;
        articleSentenceForms: ArticleSentenceForm[];
      }
    | {
        users: User[];
        article: Article;
        sentences: ArticleSentence[];
        articleBlob: Blob | null;
        articleSentenceForms: ArticleSentenceForm[];
      };
};

export const reducer = (state: State, action: Action): State => {
  const { type, payload } = action;
  const { articleList, sentences, workoutList, quizzes } = state;

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
    case ActionTypes.toggleIsShowParses: {
      const articleId = payload as string;
      const article = articleList.find((item) => item.id === articleId);
      if (!article) return state;
      const { isShowParse } = article;

      const updatedList = articleList.map((item) =>
        item.id == articleId
          ? {
              ...item,
              isShowParse: !isShowParse,
            }
          : item
      );
      return R.compose(
        R.assocPath<Article[], State>(['articleList'], updatedList),
        R.assocPath<boolean, State>(['article', 'isShowParse'], !isShowParse),
        R.assocPath<boolean, State>(
          ['memo', 'articles', articleId, 'isShowParse'],
          !isShowParse
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
    case ActionTypes.initialArticle: {
      return R.compose(
        R.assocPath<boolean, State>(['isFetching'], true),
        R.assocPath<Article, State>(['article'], INITIAL_ARTICLE),
        R.assocPath<ArticleSentence[], State>(['sentences'], []),
        R.assocPath<ArticleSentenceForm[], State>(['articleSentenceForms'], [])
      )(state);
    }
    case ActionTypes.updateSentences: {
      const { articleId, sentences } = payload as {
        articleId: string;
        sentences: ArticleSentence[];
      };

      return R.compose(
        R.assocPath<ArticleSentence[], State>(['sentences'], sentences),
        R.assocPath<ArticleSentence[], State>(
          ['memo', 'sentences', articleId],
          sentences
        )
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
    case ActionTypes.setArticleSingle: {
      const article = payload as Article;
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
        R.assocPath<Article, State>(['article'], article),
        R.assocPath<Article[], State>(['articleList'], updatedList),
        R.assocPath<Article, State>(['memo', 'articles', article.id], article)
      )(state);
    }
    case ActionTypes.deleteArticle: {
      const articleId = payload as string;
      const updatedList = articleList.filter((item) => item.id !== articleId);

      return R.compose(
        R.assocPath<Article[], State>(['articleList'], updatedList),
        R.assocPath<Article, State>(['article'], INITIAL_ARTICLE),
        R.assocPath<ArticleSentence[], State>(['sentences'], []),
        R.assocPath<null, State>(['articleBlob'], null),
        R.assocPath<ArticleSentenceForm[], State>(['articleSentenceForms'], []),
        R.dissocPath<State>(['memo', 'articles', articleId]),
        R.dissocPath<State>(['memo', 'sentences', articleId]),
        R.dissocPath<State>(['memo', 'articleBlobs', articleId]),
        R.dissocPath<State>(['memo', 'articleSentenceForms', articleId])
      )(state);
    }
    case ActionTypes.setArticle: {
      const { article, sentences, articleSentenceForms, articleBlob } =
        payload as {
          article: Article;
          sentences: ArticleSentence[];
          articleBlob: Blob | null;
          articleSentenceForms: ArticleSentenceForm[];
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
        R.assocPath<ArticleSentenceForm[], State>(
          ['articleSentenceForms'],
          articleSentenceForms
        ),
        R.assocPath<Article, State>(['memo', 'articles', article.id], article),
        R.assocPath<Blob | null, State>(
          ['memo', 'articleBlobs', article.id],
          articleBlob
        ),
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
      const quiz = payload as Quiz;
      let isCreateNew = !quizzes.find((item) => item.id === quiz.id);
      let updatedQuizzes = [...quizzes];
      if (isCreateNew) {
        updatedQuizzes.unshift(quiz);
      } else {
        updatedQuizzes = updatedQuizzes.map((item) =>
          item.id === quiz.id ? quiz : item
        );
      }
      return R.compose(R.assocPath<Quiz[], State>(['quizzes'], updatedQuizzes))(
        state
      );
    }
    case ActionTypes.deleteQuiz: {
      const quizId = payload as string;
      const updatedQuizzes = quizzes.filter((quiz) => quiz.id !== quizId);
      return R.compose(
        R.assocPath<Quiz[], State>(['quizzes'], updatedQuizzes),
        R.dissocPath<State>(['quizBlobs', quizId])
      )(state);
    }
    case ActionTypes.setArticleForm: {
      const { users, article, sentences, articleSentenceForms, articleBlob } =
        payload as {
          users: User[];
          article: Article;
          articleBlob: Blob | null;
          sentences: ArticleSentence[];
          articleSentenceForms: ArticleSentenceForm[];
        };
      return R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<User[], State>(['users'], users),
        R.assocPath<Article, State>(['article'], article),
        R.assocPath<Blob | null, State>(['articleBlob'], articleBlob),
        R.assocPath<ArticleSentence[], State>(['sentences'], sentences),
        R.assocPath<ArticleSentenceForm[], State>(
          ['articleSentenceForms'],
          articleSentenceForms
        ),
        R.assocPath<Article, State>(['memo', 'articles', article.id], article),
        R.assocPath<Blob | null, State>(
          ['memo', 'articleBlobs', article.id],
          articleBlob
        ),
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
    case ActionTypes.updateSentence: {
      const { sentence, articleId } = payload as {
        articleId: string;
        sentence: ArticleSentence;
      };
      const updatedSentences = sentences.map((item) =>
        item.id === sentence.id ? sentence : item
      );
      return R.compose(
        R.assocPath<ArticleSentence[], State>(['sentences'], updatedSentences),
        R.assocPath<ArticleSentence[], State>(
          ['memo', 'sentences', articleId],
          updatedSentences
        )
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
    case ActionTypes.setArticleSentenceForm: {
      const { articleId, sentenceIndex, articleSentenceForm } = payload as {
        articleId: string;
        sentenceIndex: number;
        articleSentenceForm: ArticleSentenceForm;
      };
      return R.compose(
        R.assocPath<ArticleSentenceForm, State>(
          ['articleSentenceForms', sentenceIndex],
          articleSentenceForm
        ),
        R.assocPath<ArticleSentenceForm, State>(
          ['memo', 'articleSentenceForms', articleId, sentenceIndex],
          articleSentenceForm
        )
      )(state);
    }
    default:
      return R.compose(R.identity)(state);
  }
};
