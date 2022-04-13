import {
  where,
  orderBy,
  Unsubscribe,
  DocumentData,
  QueryConstraint,
} from '@firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Accent } from '../entities/Accent';
import { db } from '../repositories/firebase';
import {
  batchAddDocuments,
  batchDeleteDocuments,
  batchUpdateDocuments,
  getDocumentsByQuety,
  snapshotCollection,
  updateDocument,
} from '../repositories/utils';

export type OndokuSentence = {
  id: string;
  end: number;
  line: number;
  start: number;
  ondoku: string;
  accents: Accent[];
  japanese: string;
  createdAt: number;
};

export const INITIAL_ONDOKU_SENTENCE: OndokuSentence = {
  id: '',
  end: 0,
  line: 0,
  start: 0,
  ondoku: '',
  accents: [],
  japanese: '',
  createdAt: 0,
};

const COLLECTION = 'oSentences';

export const useOndokuSentences = ({
  ondokuId,
  ondokuSentenceId,
}: {
  ondokuId: string;
  ondokuSentenceId: string;
}) => {
  const [ondokuSentence, setOndokuSentence] = useState(INITIAL_ONDOKU_SENTENCE);
  const [ondokuSentences, setOndokuSentences] = useState<OndokuSentence[]>([]);

  const _snapshotCollection = useMemo(
    () =>
      function <T>({
        queries,
        setValues,
        buildValue,
      }: {
        queries?: QueryConstraint[];
        setValues: (value: T[]) => void;
        buildValue: (value: DocumentData) => T;
      }): Unsubscribe {
        return snapshotCollection({
          db,
          colId: COLLECTION,
          queries,
          setValues,
          buildValue,
        });
      },
    []
  );

  useEffect(() => {
    const ondokuSentence = ondokuSentences.filter(
      (ondokuSentence) => ondokuSentence.id === ondokuSentenceId
    )[0];
    setOndokuSentence(ondokuSentence ?? INITIAL_ONDOKU_SENTENCE);
  }, [ondokuSentenceId, ondokuSentences]);

  useEffect(() => {
    const unsub = _snapshotCollection({
      setValues: setOndokuSentences,
      buildValue: buildOndokuSentence,
      queries: [where('ondoku', '==', ondokuId), orderBy('line')],
    });
    return () => {
      unsub();
    };
  }, [ondokuId]);

  return { ondokuSentence, ondokuSentences };
};

export const useHandleOndokuSentences = () => {
  const _updateDocument = useMemo(
    () =>
      async function <T extends { id: string }>(value: T): Promise<T | null> {
        return await updateDocument({
          db,
          colId: COLLECTION,
          value,
        });
      },
    []
  );
  const _batchDeleteDocuments = useCallback(async (ids: string[]) => {
    return await batchDeleteDocuments({ db, colId: COLLECTION, ids });
  }, []);

  const _batchUpdateDocuments = useMemo(
    () =>
      async function <T extends { id: string }>(values: T[]): Promise<boolean> {
        return await batchUpdateDocuments({ db, colId: COLLECTION, values });
      },
    []
  );

  const _batchAddDocuments = useMemo(
    () =>
      async function <T extends { id: string }>(
        values: Omit<T, 'id'>[]
      ): Promise<boolean> {
        return await batchAddDocuments({ db, colId: COLLECTION, values });
      },
    []
  );

  const updateOndokuSentence = async (
    ondokuSentence: OndokuSentence
  ): Promise<OndokuSentence | null> => {
    return await _updateDocument(ondokuSentence);
  };

  const updateOndokuSentences = async (ondokuSentences: OndokuSentence[]) => {
    return await _batchUpdateDocuments(ondokuSentences);
  };

  const addOndokuSentences = async (
    ondokuSentences: Omit<OndokuSentence, 'id'>[]
  ) => {
    return await _batchAddDocuments(ondokuSentences);
  };

  const deleteOndokuSentences = async (ondokuId: string) => {
    const ids = await getDocumentsByQuety({
      db,
      colId: COLLECTION,
      queries: [where('ondoku', '==', ondokuId)],
      buildValue: (doc: DocumentData) => doc.id as string,
    });
    _batchDeleteDocuments(ids);
  };
  return {
    deleteOndokuSentences,
    updateOndokuSentence,
    updateOndokuSentences,
    addOndokuSentences,
  };
};

const buildOndokuSentence = (doc: DocumentData): OndokuSentence => {
  return {
    id: doc.id,
    end: doc.data().end,
    line: doc.data().line,
    start: doc.data().start,
    ondoku: doc.data().ondoku,
    accents: doc.data().accents,
    japanese: doc.data().japanese,
    createdAt: doc.data().createdAt,
  };
};
