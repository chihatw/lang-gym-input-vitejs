import React from 'react';
import { Typography } from '@mui/material';

import LinkButton from './LinkButton';

const TablePageHeader = ({
  links,
  label,
}: {
  label: string;
  links?: { label: string; pathname: string }[];
}) => (
  <div style={{ display: 'grid', rowGap: 16 }}>
    <Typography variant='h5'>{label}</Typography>
    {links?.map((link, index) => (
      <div key={index}>
        <LinkButton label={link.label} pathname={link.pathname} />
      </div>
    ))}
  </div>
);

export default TablePageHeader;
