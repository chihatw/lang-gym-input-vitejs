import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import {
  PersonAdd,
  Subject,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import Person from '@mui/icons-material/Person';
import Mic from '@mui/icons-material/Mic';
import React from 'react';
import { Ondoku } from '../../../../entities/Ondoku';
import dayjs from 'dayjs';

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
          return (
            <TableRow key={ondoku.id}>
              <TableCell>
                <Box
                  sx={{ userSelect: 'none' }}
                  display='flex'
                  justifyContent='space-between'
                >
                  <Box>{ondoku.title}</Box>
                  <Box>{dayjs(ondoku.createdAt).format('YYYY年M月D日')}</Box>
                </Box>
              </TableCell>
              <TableCell padding='none'>
                <IconButton size='small' onClick={() => onEdit(ondoku)}>
                  <Edit />
                </IconButton>
              </TableCell>
              <TableCell padding='none'>
                <IconButton size='small' onClick={() => onAddUidOndoku(ondoku)}>
                  <PersonAdd />
                </IconButton>
              </TableCell>
              <TableCell padding='none'>
                <IconButton
                  size='small'
                  onClick={() => onToggleShowAccents(ondoku)}
                >
                  {ondoku.isShowAccents ? (
                    <VisibilityOutlined />
                  ) : (
                    <VisibilityOffOutlined />
                  )}
                </IconButton>
              </TableCell>
              <TableCell padding='none'>
                <IconButton
                  size='small'
                  onClick={() => onShowSentences(ondoku)}
                >
                  <Subject />
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
                  <Person />
                </IconButton>
              </TableCell>
              <TableCell padding='none'>
                <IconButton size='small' onClick={() => onDelete(ondoku)}>
                  <Delete />
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
