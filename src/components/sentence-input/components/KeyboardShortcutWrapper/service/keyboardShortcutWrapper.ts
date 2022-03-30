// tutorial: https://johannesklauss.github.io/react-hotkeys-hook/
// github: https://github.com/JohannesKlauss/react-hotkeys-hook
// Supported Keys: shift, option, alt, ctrl, control, command,
// backspace, tab, clear, enter, return, esc, escape, space,
// up, down, left, right, home, end, pageup, pagedown, del, delete and f1 through f19.

import { useHotkeys } from 'react-hotkeys-hook';
import { useHandleBranch } from './handleBranch';
import { useHandleSentence } from './handleSentence';
import { useHandleWord } from './handleWord';

export const useKeyboardShortcutWrapper = () => {
  const sentenceKeyMaps = useHandleSentence();
  const branchKeyMaps = useHandleBranch();
  const wordKeyMaps = useHandleWord();

  const keyMaps = sentenceKeyMaps.concat(wordKeyMaps).concat(branchKeyMaps);

  useHotkeys(
    keyMaps.map((i) => i.key).join(','),
    (event: KeyboardEvent, handler: { key: string }) => {
      event.preventDefault();
      keyMaps.filter((i) => i.key === handler.key)[0].action();
    },
    {
      enableOnTags: ['INPUT'], // INPUTタグの中でもショートカットキーを有効に
    }
  );
};
