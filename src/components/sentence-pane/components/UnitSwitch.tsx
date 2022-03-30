import React, { useContext } from 'react';

import PlainUnitPane from './PlainUnitPane';
import MeishikuUnitPane from './MeishikuUnitPane';
import MeishiBunmatsuUnitPane from './MeishiBunmatsuUnitPane';
import { SentencePaneContext } from '../sentence-pane';

const UnitSwitch: React.FC<{
  unitId: string;
}> = ({ unitId }) => {
  const { units } = useContext(SentencePaneContext);
  const unit = units[unitId];
  switch (unit.type) {
    case 'meishibunmatsu':
      return <MeishiBunmatsuUnitPane unitId={unitId} />;
    case 'meishiku':
      return <MeishikuUnitPane unitId={unitId} />;
    case 'plain':
      return <PlainUnitPane unitId={unitId} />;
    default:
      return <></>;
  }
};
export default UnitSwitch;
