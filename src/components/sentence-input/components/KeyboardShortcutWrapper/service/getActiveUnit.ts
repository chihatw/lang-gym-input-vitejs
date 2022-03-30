import { Unit } from '../../../entities/Unit';

export const getActiveUnit = (units: {
  [id: string]: Unit;
}): Unit | undefined => {
  const activeElement = document.activeElement;
  if (!activeElement) return;
  const activeTagName = (activeElement as HTMLElement).tagName;
  if (activeTagName !== 'INPUT') return;
  const wordID = activeElement.id.slice(4); // id から txt_ を削除
  const unitID = Object.keys(units).filter((unitID) => {
    return units[unitID].wordID === wordID;
  })[0];
  if (!unitID) return;
  return units[unitID];
};
