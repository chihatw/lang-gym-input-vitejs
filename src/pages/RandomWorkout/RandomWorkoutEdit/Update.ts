import * as R from 'ramda';
import { RandomWorkoutFormState } from './Model';

export const RandomWorkoutFormActionTypes = {
  setState: 'setState',
};

export type RandomWorkoutFormAction = {
  type: string;
  payload: RandomWorkoutFormState;
};

export const randomWorkoutFormReducer = (
  state: RandomWorkoutFormState,
  action: RandomWorkoutFormAction
): RandomWorkoutFormState => {
  const { type, payload } = action;
  switch (type) {
    case RandomWorkoutFormActionTypes.setState: {
      const updated = payload as RandomWorkoutFormState;
      return updated;
    }
    default:
      return R.compose(R.identity)(state);
  }
};
