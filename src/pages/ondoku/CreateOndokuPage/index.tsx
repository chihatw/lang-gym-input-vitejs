import React from 'react';
import { useCreateOndokuPage } from './services/createOndokuPage';
import OndokuForm from '../../../components/organisms/OndokuForm';
import TableLayout from '../../../components/templates/TableLayout';

const CreateOndokuPage = () => {
  const {
    date,
    onSubmit,
    onPickDate,
    isShowAccents,
    textFieldItems,
    onToggleShowAccents,
  } = useCreateOndokuPage();
  return (
    <TableLayout title='音読作成' backURL='/ondoku/list'>
      <OndokuForm
        date={date}
        onSubmit={onSubmit}
        onPickDate={onPickDate}
        isShowAccents={isShowAccents}
        textFieldItems={textFieldItems}
        submitButtonLabel='作成'
        onToggleShowAccents={onToggleShowAccents}
      />
    </TableLayout>
  );
};

export default CreateOndokuPage;
