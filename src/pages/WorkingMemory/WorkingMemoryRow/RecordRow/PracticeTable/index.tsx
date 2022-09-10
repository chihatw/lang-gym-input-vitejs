import React from 'react';
import { WorkingMemoryLog } from '../../../../../Model';
import PracticeTableHeader from './PracticeTableHeader';
import PracticeTableRow from './PracticeTableRow';

const PracticeTable = ({ log }: { log: WorkingMemoryLog }) => {
  return (
    <div style={{ display: 'grid', rowGap: 0, paddingLeft: 8 }}>
      <PracticeTableHeader />
      {Object.values(log.practice).map((_, index) => (
        <PracticeTableRow key={index} log={log} index={index} />
      ))}
    </div>
  );
};

export default PracticeTable;
