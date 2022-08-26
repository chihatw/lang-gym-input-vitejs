import { Card, CardContent, Container } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import LinkButton from '../../components/ui/LinkButton';
import {
  State,
  WorkingMemory,
  WorkingMemoryAnswer,
  WorkingMemoryAnswerLog,
  WorkingMemoryCue,
} from '../../Model';
import { getWorkingMemories } from '../../services/workingMemory';
import { ActionTypes } from '../../Update';

const WorkingMemoryListPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!state.isFetching || !dispatch) return;
    const fetchData = async () => {
      const _workingMemories = Object.keys(state.workingMemories).length
        ? state.workingMemories
        : await getWorkingMemories();

      console.log({ _workingMemories });
      const updatedState: State = {
        ...state,
        isFetching: false,
        workingMemories: _workingMemories,
      };

      dispatch({
        type: ActionTypes.setState,
        payload: updatedState,
      });
    };
    fetchData();
  }, [state.isFetching]);
  return (
    <Container maxWidth='sm' sx={{ paddingTop: 2, paddingBottom: 30 }}>
      <div style={{ display: 'grid', rowGap: 16, color: '#555' }}>
        <h2>作業記憶練習一覧</h2>
        <div>
          <LinkButton label={'戻る'} pathname={'/'} />
        </div>
        {Object.values(state.workingMemories)
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((workingMemory, index) => (
            <WorkingMemoryRow workingMemory={workingMemory} key={index} />
          ))}
      </div>
    </Container>
  );
};

export default WorkingMemoryListPage;

const WorkingMemoryRow = ({
  workingMemory,
}: {
  workingMemory: WorkingMemory;
}) => {
  const { state } = useContext(AppContext);
  return (
    <Card>
      <CardContent>
        <div
          style={{
            display: 'grid',
            rowGap: 8,
            fontSize: 14,
            marginBottom: -8,
          }}
        >
          <div style={{ display: 'flex' }}>
            <div style={{ flexBasis: 40 }}>
              {state.users.find((item) => item.id === workingMemory.uid)
                ?.displayname || ''}
            </div>
            <div>{workingMemory.title}</div>
          </div>
          <div style={{ display: 'grid', rowGap: 16, paddingLeft: 8 }}>
            {Object.values(workingMemory.answers)
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((answer, index) => (
                <RecordRow
                  key={index}
                  answer={answer}
                  cues={workingMemory.cues}
                />
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RecordRow = ({
  answer,
  cues,
}: {
  answer: WorkingMemoryAnswer;
  cues: { [id: string]: WorkingMemoryCue };
}) => {
  const date = new Date(answer.createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>{`${year}/${month}/${day} ${hours}:${minutes}`}</div>
        <div>{`前${answer.offset}項 正解率:${answer.correctRatio}% 回答時間: ${answer.duration} 秒`}</div>
      </div>
      <div style={{ display: 'grid', rowGap: 8, paddingLeft: 8 }}>
        {Object.values(answer.log).map((log, index) => (
          <LogRow
            index={index}
            log={log}
            key={index}
            answer={answer.cueIds[index]}
            listening={answer.cueIds[index + answer.offset] || '--'}
          />
        ))}
      </div>
    </div>
  );
};

const LogRow = ({
  log,
  index,
  answer,
  listening,
}: {
  log: WorkingMemoryAnswerLog;
  index: number;
  answer: string;
  listening: string;
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', fontSize: 12 }}>
      <div style={{ flexBasis: 24 }}>{index + 1}</div>
      <div style={{ flexGrow: 1, display: 'grid', rowGap: 0 }}>
        <div>{`正解:${answer}　　播放: ${listening}　　${log.duration} 秒`}</div>
        <div style={{ display: 'flex' }}>
          <div style={{ flexBasis: 60 }}>Tapped:</div>
          <div>
            {Object.values(log.tapped).map((item, index) => {
              const isLast = index === Object.values(log.tapped).length - 1;
              const isWrong = isLast && item !== answer;
              return (
                <span key={index}>
                  <span
                    style={{
                      color: isLast ? (isWrong ? 'red' : 'inherit') : '#ccc',
                    }}
                  >
                    {item}
                  </span>
                  {!isLast && <span>, </span>}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
