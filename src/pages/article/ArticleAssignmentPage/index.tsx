import Speaker from '@bit/chihatw.lang-gym.speaker';
import { Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Card, IconButton } from '@mui/material';
import React, { useContext } from 'react';

import TableLayout from '../../../components/templates/TableLayout';
import { AppContext } from '../../../services/app';
import { AssignmentSentence } from '../../../services/useAssignmentSentences';

// ArticleList から
// TODO merge to Article Page

const ArticleAssignmentPage = () => {
  const navigate = useNavigate();

  const { article, isFetching, assignment, assignmentSentences } =
    useContext(AppContext);

  const handleClickCard = (assignmentSentence: AssignmentSentence) => {
    navigate(
      `/article/${article.id}/assignment/uid/${assignmentSentence.uid}/line/${assignmentSentence.line}`
    );
  };

  if (isFetching) {
    return <></>;
  } else {
    return (
      <TableLayout
        title={`${article.title} - 提出アクセント`}
        backURL='/article/list'
      >
        <div style={{ display: 'grid', rowGap: 16 }}>
          {assignmentSentences.map((assignmentSentence, index) => {
            return (
              <Card>
                <div
                  style={{
                    color: '#555',
                    rowGap: 16,
                    display: 'grid',
                    padding: 8,
                    fontSize: 12,
                  }}
                >
                  <div>{`${index + 1}.`}</div>
                  <div style={{ padding: '0 8px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Speaker
                        start={assignmentSentence.start}
                        end={assignmentSentence.end}
                        downloadURL={assignment.downloadURL}
                      />
                      <IconButton
                        onClick={() => handleClickCard(assignmentSentence)}
                      >
                        <Edit />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </TableLayout>
    );
  }
};

export default ArticleAssignmentPage;
