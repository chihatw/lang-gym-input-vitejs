import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SubjectIcon from '@mui/icons-material/Subject';
import PersonIcon from '@mui/icons-material/Person';
import Mic from '@mui/icons-material/Mic';
import React from 'react';

import { Ondoku } from '../../../../services/useOndokus';

const OndokuTable: React.FC<{
  ondokus: Ondoku[];
  onEdit: (ondoku: Ondoku) => void;
  onShowSentences: (ondoku: Ondoku) => void;
  onAddUidOndoku: (ondoku: Ondoku) => void;
  onToggleShowAccents: (ondoku: Ondoku) => Promise<void>;
  onShowVoice: (ondoku: Ondoku) => void;
  onDelete: (ondoku: Ondoku) => Promise<void>;
  onShowAssignment: (ondoku: Ondoku) => void;
}> = ({
  ondokus,
  onEdit,
  onAddUidOndoku,
  onToggleShowAccents,
  onShowVoice,
  onShowSentences,
  onShowAssignment,
  onDelete,
}) => {
  return (
    <Table>
      <TableBody>
        {ondokus.map((ondoku) => {
          const date = new Date(ondoku.createdAt);
          return (
            <TableRow key={ondoku.id}>
              <TableCell>
                <Box
                  sx={{ userSelect: 'none' }}
                  display='flex'
                  justifyContent='space-between'
                >
                  <Box>{ondoku.title}</Box>
                  <Box>{`${date.getFullYear()}年${
                    date.getMonth() + 1
                  }月${date.getDate()}日`}</Box>
                </Box>
              </TableCell>
              <TableCell padding='none'>
                <IconButton size='small' onClick={() => onEdit(ondoku)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell padding='none'>
                <IconButton size='small' onClick={() => onAddUidOndoku(ondoku)}>
                  <PersonAddIcon />
                </IconButton>
              </TableCell>
              <TableCell padding='none'>
                <IconButton
                  size='small'
                  onClick={() => onToggleShowAccents(ondoku)}
                >
                  {ondoku.isShowAccents ? (
                    <VisibilityOutlinedIcon />
                  ) : (
                    <VisibilityOffOutlinedIcon />
                  )}
                </IconButton>
              </TableCell>
              <TableCell padding='none'>
                <IconButton
                  size='small'
                  onClick={() => onShowSentences(ondoku)}
                >
                  <SubjectIcon />
                </IconButton>
              </TableCell>
              <TableCell padding='none'>
                <IconButton size='small' onClick={() => onShowVoice(ondoku)}>
                  <Mic />
                </IconButton>
              </TableCell>
              <TableCell padding='none'>
                <IconButton
                  size='small'
                  disabled={!ondoku.downloadURL}
                  onClick={() => onShowAssignment(ondoku)}
                >
                  <PersonIcon />
                </IconButton>
              </TableCell>
              <TableCell padding='none'>
                <IconButton size='small' onClick={() => onDelete(ondoku)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default OndokuTable;
