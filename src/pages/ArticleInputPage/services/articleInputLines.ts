import { useContext, useEffect, useState } from 'react';
import { ArticleInputPageContext } from './articleInputPage';

export const useArticleInputLines = () => {
  const { chinese, original, corrected, setCorrected } = useContext(
    ArticleInputPageContext
  );
  const [display, setDisplay] = useState<string[]>([]);
  useEffect(() => {
    const display: string[] = corrected.map((line) => {
      let isValid = true;
      let parts = line.split('**');
      // 分割後が偶数の場合は処理しない
      parts.length % 2 === 0 && (isValid = false);
      const hasStartStar = line.slice(0, 2) === '**';

      return parts
        .filter((i) => i)
        .map((part, index) => {
          let isColored = false;
          if (isValid) {
            if (
              (hasStartStar && index % 2 === 0) ||
              (!hasStartStar && index % 2 === 1)
            ) {
              isColored = true;
            }
          }
          return `<span style='${
            isColored ? 'color:red;' : ''
          }'>${part}</span>`;
        })
        .join('');
    });
    setDisplay(display);
  }, [corrected]);

  const onExportLineSet = async () => {
    const result: string[] = [];
    original.forEach((line, index) => {
      result.push(`原文：${line}`);
      result.push(`修正：${corrected[index]}`);
      result.push(`中文：${chinese[index]}`);
      result.push(``);
    });
    const text = result.join('\n');
    await navigator.clipboard.writeText(text);
  };
  return {
    chinese,
    original,
    setCorrected,
    display,
    corrected,
    onExportLineSet,
  };
};
