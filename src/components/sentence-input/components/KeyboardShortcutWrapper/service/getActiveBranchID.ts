import { Branch } from '../../../entities/Branch';

export const getActiveBranchID = (
  unitID: string,
  branches: { [id: string]: Branch }
) => {
  const branchID = Object.keys(branches).filter(
    (branchID) => branches[branchID].unitID === unitID
  )[0];
  return branchID;
};
