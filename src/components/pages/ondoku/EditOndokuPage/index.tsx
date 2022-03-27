import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useEditOndokuPage } from './services/editOndokuPage';
import OndokuForm from '../../../organisms/OndokuForm';
import TableLayout from '../../../templates/TableLayout';

const EditOndokuPage = () => {
  const match = useRouteMatch<{ id: string }>();
  const {
    date,
    onSubmit,
    onPickDate,
    isShowAccents,
    textFieldItems,
    onToggleShowAccents,
  } = useEditOndokuPage(match.params.id);
  return (
    <TableLayout title='音読編集' backURL='/ondoku/list'>
      <OndokuForm
        date={date}
        onSubmit={onSubmit}
        onPickDate={onPickDate}
        isShowAccents={isShowAccents}
        textFieldItems={textFieldItems}
        submitButtonLabel='更新'
        onToggleShowAccents={onToggleShowAccents}
      />
    </TableLayout>
  );
};

export default EditOndokuPage;
