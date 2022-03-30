import { Button, IconButton, Tooltip } from '@mui/material';

import { Delete, InfoRounded } from '@mui/icons-material';
import React from 'react';
import { useToolBar } from '../services/toolBar';

const INFOMATIONS: string[] = [
  '<センテンス>:',
  'ctrl+◯:トグル',
  '文頭成分(b)、主題(t)、:終助詞(s)',
  '準体助詞(n)、:準体助詞文末(d)',
  'ctrl+c:コメント追加',
  'shift+ctrl+c:動詞コメントを追加',
  'ctrl+r:センテンス削除',
  'ctrl+f:最終文にフォーカス',
  '<ブランチ>:',
  'shift+ctrl+◯:名詞ブランチ追加',
  'が(g)、に(i)、を(w)、:で(d)、と(t)、へ(e)',
  'から(k)、より(y)、:は(h)、も(m)、の(n)',
  'shift+ctrl+v:動詞ブランチ追加',
  'shift+ctrl+r/p:ブランチ削除',
  '<単語>:',
  'shift+ctrl+cmd+◯:品詞変更',
  '名詞(m)、時数詞(j)、:動詞(d)、い形容詞(i)',
  'な形容詞(n)、副詞(h)、:連体詞(r)、文(s)',
];

const ToolBar: React.FC = () => {
  const { items, isLastSentence, onDeleteSentence } = useToolBar();
  return (
    <div style={{ display: 'flex' }}>
      {items.map((item, index) => (
        <div key={index} style={{ display: 'flex' }}>
          <Button
            style={{ whiteSpace: 'nowrap' }}
            variant='contained'
            onClick={item.onClick}
            disabled={item.disabled}
            onKeyDown={(e) => {}}
          >
            <span>{item.label}</span>
            <span
              style={{
                fontSize: 10,
                marginLeft: 4,
                marginRight: -8,
                textTransform: 'none',
              }}
            >
              {`(${item.shortcutKey})`}
            </span>
          </Button>
          {!!items[index + 1] && <div style={{ width: 20 }} />}
        </div>
      ))}

      {isLastSentence && (
        <>
          <div style={{ width: 4 }} />
          <Tooltip title='文削除'>
            <IconButton
              onClick={onDeleteSentence}
              style={{ marginTop: -6, marginBottom: -6 }}
            >
              <Delete />
              <span
                style={{
                  color: '#777',
                  fontSize: 10,
                  marginLeft: 4,
                  marginRight: -8,
                }}
              >
                (^r)
              </span>
            </IconButton>
          </Tooltip>
        </>
      )}
      {!!INFOMATIONS.length && (
        <div>
          <Tooltip
            title={
              <table>
                <tbody>
                  {INFOMATIONS.map((i, index) => (
                    <tr key={index}>
                      {i.split(':').map((cell, cIndex) => (
                        <td key={cIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          >
            <IconButton size='small'>
              <InfoRounded />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default ToolBar;
