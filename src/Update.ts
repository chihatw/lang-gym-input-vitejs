import { User as FirebaseUser } from 'firebase/auth';
import * as R from 'ramda';
import {
  User,
  State,
  Article,
  Workout,
  RandomWorkout,
  INITIAL_WORKOUT,
  ArticleSentence,
} from './Model';

export const ActionTypes = {
  setUser: 'setUser',
  setState: 'setState',
  setWorkout: 'setWorkout',
  startFetching: 'startFetching',
  deleteWorkout: 'deleteWorkout',
  setWorkoutList: 'setWorkoutList',
  setWorkoutSingle: 'setWorkoutSingle',
  setRandomWorkouts: 'setRandomWorkouts',
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
  const { workoutList } = state;

  switch (type) {
    case ActionTypes.setState: {
      const updatedState = payload as State;
      return updatedState;
    }
    case ActionTypes.setRandomWorkouts: {
      const randomWorkouts = payload as { [key: string]: RandomWorkout };
      console.log('%csetRandomWorkouts', 'color:green');
      return R.compose(
        R.assocPath<{ [key: string]: RandomWorkout }, State>(
          ['randomWorkouts'],
          randomWorkouts
        )
      )(state);
    }

    case ActionTypes.setUser: {
      const user = payload as FirebaseUser | null;
      console.log('%csetUser', 'color:green');
      return R.compose(
        R.assocPath<boolean, State>(['initializing'], false),
        R.assocPath<FirebaseUser | null, State>(['user'], user)
      )(state);
    }

    case ActionTypes.startFetching: {
      console.log('%cstartFetching', 'color:green');
      return R.compose(R.assocPath<boolean, State>(['isFetching'], true))(
        state
      );
    }
    case ActionTypes.setWorkoutList: {
      const { workoutList, users } = payload as {
        workoutList: Workout[];
        users: User[];
      };
      console.log('%csetWorkoutList', 'color:green');
      return R.compose(
        R.assocPath<User[], State>(['users'], users),
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<Workout[], State>(['workoutList'], workoutList)
      )(state);
    }
    case ActionTypes.setWorkout: {
      const { workout, users } = payload as { workout: Workout; users: User[] };
      console.log('%csetWorkout', 'color:green');
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
      console.log('%csetWorkoutSingle', 'color:green');
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
      console.log('%cdeleteWorkout', 'color:green');
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
      console.log('%cuploadArticleAudioFile', 'color:green');
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
      console.log('%cdeleteArticleAudioFile', 'color:green');
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
