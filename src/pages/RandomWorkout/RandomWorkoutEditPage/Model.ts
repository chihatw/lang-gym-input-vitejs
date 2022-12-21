import { INITIAL_RANDOM_WORKOUT, RandomWorkout, User } from '../../../Model';

export type RandomWorkoutFormState = RandomWorkout & {
  cuesStr: string;
};

export const INITIAL_RANDOM_WORKOUT_FORM_STATE: RandomWorkoutFormState = {
  ...INITIAL_RANDOM_WORKOUT,
  cuesStr: '',
};
