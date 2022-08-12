import { INITIAL_RANDOM_WORKOUT, RandomWorkout, User } from '../../../Model';

export type RandomWorkoutFormState = RandomWorkout & {
  users: User[];
  cuesStr: string;
};

export const INITIAL_RANDOM_WORKOUT_FORM_STATE: RandomWorkoutFormState = {
  ...INITIAL_RANDOM_WORKOUT,
  cuesStr: '',
  users: [],
};
