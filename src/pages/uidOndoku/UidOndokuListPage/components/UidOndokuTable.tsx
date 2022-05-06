import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { UidOndoku } from '../../../../services/useUidOndokus';

const UidOndokuTable: React.FC<{
  uidOndokus: UidOndoku[];
  titles: { [key: string]: string };
  displaynames: { [key: string]: string };
  onDelete: (uidOndoku: UidOndoku) => void;
}> = ({ uidOndokus, onDelete, displaynames, titles }) => {
  return (
    <Table>
      <TableBody>
        {uidOndokus.map((uidOndoku) => (
          <TableRow key={uidOndoku.id}>
            <TableCell>{displaynames[uidOndoku.uid]}</TableCell>
            <TableCell>{titles[uidOndoku.ondoku!.id]}</TableCell>
            <TableCell padding='none'>
              <IconButton size='small' onClick={() => onDelete(uidOndoku)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UidOndokuTable;
