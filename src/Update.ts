import * as R from 'ramda';
import { State } from './Model';

export const ActionTypes = {};

export type Action = {
  type: string;
  payload?: string;
};

export const reducer = (state: State, action: Action): State => {
  const { type } = action;
  switch (type) {
    default:
      return R.compose(R.identity)(state);
  }
};
