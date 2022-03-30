import { css } from '@emotion/css';
import React from 'react';

const BodyTexts: React.FC<{ labels: string[] }> = ({ labels }) => {
  return (
    <div
      className={css({
        color: 'white',
        fontSize: 12,
        userSelect: 'none',
        fontWeight: 500,
      })}
    >
      {labels.map((label, index) => (
        <span key={index}>
          <span>{label}</span>
          {!!labels[index + 1] && (
            <span style={{ width: '0.5em', display: 'inline-block' }} />
          )}
        </span>
      ))}
    </div>
  );
};

export default BodyTexts;
