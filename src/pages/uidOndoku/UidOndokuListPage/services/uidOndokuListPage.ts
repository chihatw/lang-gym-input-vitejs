import { useContext, useEffect, useMemo, useState } from 'react';

import { AppContext } from '../../../../services/app';
import {
  UidOndoku,
  useHandleUidOndokus,
} from '../../../../services/useUidOndokus';

export const useUidOndokuListPage = (_limit: number) => {
  const { ondoku, users, uidOndokus } = useContext(AppContext);

  const { deleteUidOndoku } = useHandleUidOndokus();

  const [uids, setUids] = useState<string[]>([]);
  const [ondokuIDs, setOndokuIDs] = useState<string[]>([]);
  const displaynames = useMemo(() => {
    const displaynames: { [key: string]: string } = {};
    for (const user of users) {
      displaynames[user.id] = user.displayname;
    }
    return displaynames;
  }, [users]);
  const [titles, setTitles] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!uidOndokus.length) return;

    const uids: string[] = [];
    const ondokuIDs: string[] = [];
    uidOndokus.forEach((uo) => {
      uids.push(uo.uid);
      ondokuIDs.push(uo.ondoku!.id);
    });
    setUids(uids.filter((item, index) => uids.indexOf(item) === index));
    setOndokuIDs(
      ondokuIDs.filter((item, index) => ondokuIDs.indexOf(item) === index)
    );
  }, [uidOndokus]);

  useEffect(() => {
    if (!uidOndokus || !uids.length || !ondokuIDs.length) return;
    const titles: { [key: string]: string } = {};
    ondokuIDs.map(async (id) => {
      titles[id] = !!ondoku ? ondoku.title : '';
    });
    setTitles(titles);
  }, [uids, ondokuIDs, uidOndokus, ondoku]);

  const onDelete = (uidOndoku: UidOndoku) => {
    if (
      window.confirm(
        `${displaynames[uidOndoku.uid]}の「${
          titles[uidOndoku.ondoku!.id]
        }」を削除しますか`
      )
    ) {
      deleteUidOndoku(uidOndoku.id);
    }
  };

  return { uidOndokus, onDelete, displaynames, titles };
};
