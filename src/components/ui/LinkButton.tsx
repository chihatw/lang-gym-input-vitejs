import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LinkButton = ({
  label,
  pathname,
}: {
  label: string;
  pathname: string;
}) => {
  const navigate = useNavigate();
  return (
    <Button variant='contained' onClick={() => navigate(pathname)}>
      {label}
    </Button>
  );
};

export default LinkButton;
