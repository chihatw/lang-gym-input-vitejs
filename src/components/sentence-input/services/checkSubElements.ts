import { Branch } from '../entities/Branch';
import { Unit } from '../entities/Unit';

export const checkSubElements = ({
  branchID,
  globalUnits,
  deleteUnitIDs,
  deleteWordIDs,
  globalBranches,
  deleteBranchIDs,
}: {
  branchID: string;
  globalUnits: { [id: string]: Unit };
  deleteWordIDs: string[];
  deleteUnitIDs: string[];
  globalBranches: { [id: string]: Branch };
  deleteBranchIDs: string[];
}) => {
  const branch: Branch | null = globalBranches[branchID];
  if (!branch) return;
  deleteBranchIDs.push(branch.id);

  const subUnit: Unit | null = globalUnits[branch.unitID];
  if (!!subUnit) {
    deleteUnitIDs.push(subUnit.id);
    deleteWordIDs.push(subUnit.wordID);
    subUnit.branchIDs.forEach((branchID) => {
      checkSubElements({
        branchID,
        globalUnits,
        deleteUnitIDs,
        deleteWordIDs,
        globalBranches,
        deleteBranchIDs,
      });
    });
  }
};
