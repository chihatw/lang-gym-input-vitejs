import React from 'react';
import { useKeyboardShortcutWrapper } from './service/keyboardShortcutWrapper';

const KeyboardShortcutWrapper: React.FC = ({ children }) => {
  useKeyboardShortcutWrapper();
  return <div>{children}</div>;
};

export default KeyboardShortcutWrapper;
