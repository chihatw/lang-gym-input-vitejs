import { useNavigate } from 'react-router-dom';
import { auth } from '../../../repositories/firebase';

export const useTopPage = () => {
  const navigate = useNavigate();

  const itemsArray: { label: string; onClick: () => void }[][] = [
    [
      { label: '音読一覧', onClick: () => navigate('/ondoku/list') },
      {
        label: 'ユーザー音読一覧',
        onClick: () => navigate('/uidOndoku/list'),
      },
    ],
    [
      { label: '作文一覧', onClick: () => navigate('/article/list') },
      { label: '作文処理', onClick: () => navigate('/article/input') },
    ],
    [
      {
        label: 'アクセント問題一覧',
        onClick: () => navigate('/accentsQuestion/list'),
      },
      {
        label: 'リズム問題一覧',
        onClick: () => navigate('/rhythmsQuestion/list'),
      },
    ],
    [{ label: 'audioItems', onClick: () => navigate('/audioItems') }],
    [{ label: 'バッチ処理', onClick: () => navigate('/batch') }],
    [{ label: 'Sign Out', onClick: () => auth.signOut() }],
  ];
  return { itemsArray };
};
