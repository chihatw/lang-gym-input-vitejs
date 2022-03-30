import { Delete } from '@mui/icons-material';
import shuuJoshiTexts from 'shuujoshi-texts';
import React, { useContext } from 'react';
import { IconButton, MenuItem, Select, Tooltip } from '@mui/material';

import { SentenceInputContext } from '../sentence-input';
import { useShuuJoshiInput } from '../services/shuuJoshiInput';

const ShuuJoshiInput: React.FC = () => {
  const { value, onChangeValue } = useShuuJoshiInput();
  const { onRemoveShuuJoshi } = useContext(SentenceInputContext);
  if (!!value) {
    return (
      <div style={{ marginLeft: 4 }}>
        <div
          style={{
            display: 'flex',
            padding: 4,
            borderRadius: 4,
            border: `1px solid #52a2aa`,
          }}
        >
          <Tooltip title="終助詞類" placement="right">
            <Select
              size="small"
              variant="standard"
              value={value}
              onChange={(e) => onChangeValue(e.target.value as string)}
            >
              {Object.keys(shuuJoshiTexts).map((item) => (
                <MenuItem key={item} value={item}>
                  {shuuJoshiTexts[item]}
                </MenuItem>
              ))}
            </Select>
          </Tooltip>
          <IconButton
            size="small"
            style={{ color: '#ccc' }}
            onClick={onRemoveShuuJoshi}
          >
            <Tooltip title="終助詞類削除">
              <Delete />
            </Tooltip>
          </IconButton>
        </div>
      </div>
    );
  } else {
    return <div />;
  }
};

export default ShuuJoshiInput;
